import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useAuth } from "../../hooks/useAuth.js";
import { createOrder } from "../../services/orderService.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import FormField from "../../components/FormField.jsx";
import ErrorBanner from "../../components/ErrorBanner.jsx";

const DELIVERY_FEE = 40;
const TAX_RATE = 0.08;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    zip: user?.address?.zip || "",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const tax = subtotal * TAX_RATE;
  const total = subtotal + DELIVERY_FEE + tax;

  function handleChange(e) {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleRazorpayPayment() {
    const razorpayOrder = await createPaymentOrder({
      amount: total,
      currency: "INR",
      receipt: `pizza_${Date.now()}`,
    });

    if (!window.Razorpay) {
      throw new Error("Razorpay Checkout failed to load");
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Forno",
        description: "Pizza Order",
        order_id: razorpayOrder.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#e85d04",
        },

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            resolve(response);
          } catch (err) {
            reject(err);
          }
        },

        modal: {
          ondismiss: function () {
            reject(new Error("Payment was cancelled"));
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        reject(new Error(response?.error?.description || "Payment failed"));
      });

      razorpay.open();
    });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (items.length === 0) return;

    setSubmitting(true);
    setError("");

    try {
      let razorpayPayment = null;

      if (paymentMethod === "razorpay") {
        razorpayPayment = await handleRazorpayPayment();
      }

      const order = await createOrder({
        customerName: user?.name || "Customer",

        items: items.map(
          ({ menuItemId, name, size, toppings, price, quantity }) => ({
            menuItemId,
            name,
            size,
            toppings,
            price,
            quantity,
          }),
        ),

        deliveryAddress: address,
        paymentMethod,

        subtotal,
        deliveryFee: DELIVERY_FEE,
        tax,
        total,

        ...(razorpayPayment && {
          razorpayOrderId: razorpayPayment.razorpay_order_id,
          razorpayPaymentId: razorpayPayment.razorpay_payment_id,
          razorpaySignature: razorpayPayment.razorpay_signature,
        }),
      });

      clearCart();

      navigate(`/orders/${order._id || order.id}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not place your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-8">
          <ErrorBanner message={error} />

          <section>
            <h2 className="font-display text-lg font-semibold mb-4">
              Delivery address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Street address" htmlFor="street">
                <input
                  id="street"
                  name="street"
                  required
                  className="input-field"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="184 Kiln Street, Apt 4"
                />
              </FormField>

              <FormField label="City" htmlFor="city">
                <input
                  id="city"
                  name="city"
                  required
                  className="input-field"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="Muzaffarpur"
                />
              </FormField>

              <FormField label="ZIP code" htmlFor="zip">
                <input
                  id="zip"
                  name="zip"
                  required
                  className="input-field"
                  value={address.zip}
                  onChange={handleChange}
                  placeholder="842001"
                />
              </FormField>

              <FormField
                label="Delivery instructions (optional)"
                htmlFor="instructions"
              >
                <input
                  id="instructions"
                  name="instructions"
                  className="input-field"
                  value={address.instructions}
                  onChange={handleChange}
                  placeholder="Buzzer code, gate, etc."
                />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold mb-4">Payment</h2>

            <div className="flex flex-col gap-3">
              {[
                {
                  id: "razorpay",
                  label: "Pay online with Razorpay",
                },
                {
                  id: "cash",
                  label: "Cash on delivery",
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3 cursor-pointer transition-colors ${
                    paymentMethod === option.id
                      ? "border-tomato bg-tomato/5"
                      : "border-char/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="font-display text-lg font-semibold mb-4">
            Order summary
          </h2>

          <ul className="flex flex-col gap-2 mb-4 text-sm text-char/70">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span className="truncate">
                  {item.quantity}× {item.name}
                </span>

                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-char/10 pt-4 flex flex-col gap-2 text-sm text-char/70 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{formatCurrency(DELIVERY_FEE)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          </div>

          <div className="border-t border-char/10 pt-4 flex items-center justify-between mb-6">
            <span className="font-semibold">Total</span>

            <span className="font-display text-xl font-semibold">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting || items.length === 0}
          >
            {submitting
              ? paymentMethod === "razorpay"
                ? "Processing payment..."
                : "Placing order..."
              : paymentMethod === "razorpay"
                ? "Pay & Place Order"
                : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
