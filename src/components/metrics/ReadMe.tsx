import { w } from "@solid-primitives/storage/dist/persisted-fWOjSMPO"

const MetricsReadMe = () => {
  return (
    <div class="text-start">
      <h1>Serial Metrics</h1>
      <p>
        Serial Dashboard interprets incoming serial data that starts with <b>`>`</b> as a metric. 
      </p>
      <p>All metrics folow the form <b>key:value</b>, all metrics are interpreted as floats and metric names may not include special characters.</p>
      <h2>Examples</h2>
      <pre>
        <code>&gt;metric-key:metric-value</code><br />
        <code>&gt;temp-1:212</code><br />
        <code>&gt;humidity-2:98.1</code>
      </pre>
      <p class="fw-bold">Once metrics are detected they will be available in this view, they can also be displayed in your `controller` view.</p>
    </div>
  );
};

export default MetricsReadMe;
