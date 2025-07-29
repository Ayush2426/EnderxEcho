import { useState } from "react";
import toast from "react-hot-toast";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Rating: "",
    Message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const scriptURL = "https://script.google.com/macros/s/AKfycbwQQogreoQTz1wL5DF0QLBLn6JDwEU2ZYPiFisq6aXYmkQXcxRc6G_ClDBb1HbabUWI/exec"; 
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await fetch(scriptURL, { method: "POST", body: form });
      toast.success("Thank you for your feedback!");
      setFormData({ Name: "", Email: "", Rating: "", Message: "" });
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      console.error("Error!", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  max-w-lg p-8 space-y-4 bg-base-100 rounded-2xl shadow-xl shadow-purple-600/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <h2 className="text-3xl font-bold text-center mb-8 ">Share Your Feedback</h2>

      <input
        type="text"
        name="Name"
        placeholder="Your Name"
        className="input input-bordered w-full"
        value={formData.Name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="Email"
        placeholder="Your Email"
        className="input input-bordered w-full"
        value={formData.Email}
        onChange={handleChange}
        required
      />
      <select
        name="Rating"
        className="select select-bordered w-full"
        value={formData.Rating}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Rate your experience
        </option>
        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
        <option value="4">⭐⭐⭐⭐ Good</option>
        <option value="3">⭐⭐⭐ Average</option>
        <option value="2">⭐⭐ Fair</option>
        <option value="1">⭐ Poor</option>
      </select>
      <textarea
        name="Message"
        className="textarea textarea-bordered w-full h-28"
        placeholder="Tell us more..."
        value={formData.Message}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner" />
        ) : (
          "Submit Feedback"
        )}
      </button>
    </form>
  );
};

export default FeedbackForm;
