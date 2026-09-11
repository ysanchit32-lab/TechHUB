function AboutUs() {
  return (
    <main className="page">

      <section className="about-hero">
        <span>ABOUT TECHHUB</span>
        <h1>
          Technology Made
          <span> Simple.</span>
        </h1>

        <p>
          TechHUB is an inventory and stock management
          platform designed for modern computer stores.
        </p>
      </section>

      <section className="about-grid">

        <div>
          <h2>Who We Are</h2>
          <p>
            TechHUB provides a complete platform for
            managing laptops, PCs, components and accessories.
            Our goal is to make technology shopping simple,
            efficient and reliable.
          </p>
        </div>

        <div>
          <h2>Our Mission</h2>
          <p>
            We aim to provide customers with quality
            computing products while helping businesses
            efficiently manage their inventory and stock.
          </p>
        </div>

      </section>

      <section className="values">

        <div>
          <span>01</span>
          <h3>Quality</h3>
          <p>Reliable products from trusted brands.</p>
        </div>

        <div>
          <span>02</span>
          <h3>Innovation</h3>
          <p>Modern technology and smart solutions.</p>
        </div>

        <div>
          <span>03</span>
          <h3>Customer First</h3>
          <p>Customer satisfaction is our priority.</p>
        </div>

      </section>

    </main>
  );
}

export default AboutUs;