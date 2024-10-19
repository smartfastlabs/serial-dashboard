import { Component } from "solid-js";

const Footer: Component = () => {
  return (
    <footer class="bg-light text-center text-lg-start w-100">
      <div class="w-100 row">
        <div class="col-lg-3 col-md-6 mb-4 mb-md-0"></div>
        <div class="fw-bold col-lg-6 text-center mb-3 mb-lg-0">
          <p class="mb-0">Serial Dashboard &copy; 2024 Smartfast Labs</p>
        </div>

        <div class="col-lg-3 text-lg-end text-right">
          <a
            class="github-button"
            href="https://github.com/smartfastlabs/serial-dashboard"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            data-size="large"
            aria-label="Follow @smartfastlabs on GitHub"
          >
            serial-dashboard
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
