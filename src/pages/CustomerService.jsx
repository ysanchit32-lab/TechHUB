function CustomerService() {
  return (
    <main className="page">

      <section className="page-header">
        <span>CUSTOMER SERVICE</span>
        <h1>How Can We Help?</h1>
        <p>
          Our support team is here to help you with products,
          orders, inventory and any questions you may have.
        </p>
      </section>

      <section className="service-grid">

        <div className="service-card">
          <div className="service-icon">📦</div>
          <h2>Order Support</h2>
          <p>
            Need help with your order? Contact us for
            order status, delivery and cancellation support.
          </p>
          <button>Contact Support</button>
        </div>

        <div className="service-card">
          <div className="service-icon">💻</div>
          <h2>Product Support</h2>
          <p>
            Get assistance with laptops, PCs, components
            and accessories.
          </p>
          <button>Get Help</button>
        </div>

        <div className="service-card">
          <div className="service-icon">🔧</div>
          <h2>Technical Support</h2>
          <p>
            Having a technical issue? Our team can help
            you find the right solution.
          </p>
          <button>Get Technical Help</button>
        </div>

      </section>

      <section className="contact-section">

        <div className="contact-info">
          <span>CONTACT US</span>
          <h2>We're Here For You</h2>

          <p>
            Fill out the form and our support team
            will get back to you as soon as possible.
          </p>

          <div className="contact-details">
            <p>📧 support@techhub.com</p>
            <p>📞 +91 98765 43210</p>
            <p>🕐 Monday – Saturday, 9 AM – 6 PM</p>
          </div>
        </div>

        <form
          className="support-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Your message has been submitted!");
          }}
        >

          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Subject</label>
          <input
            type="text"
            placeholder="How can we help?"
            required
          />

          <label>Message</label>
          <textarea
            rows="5"
            placeholder="Write your message..."
            required
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </section>

    </main>
  );
}

export default CustomerService;