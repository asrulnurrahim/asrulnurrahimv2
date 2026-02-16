import { highlightContent } from "./src/lib/highlight";

async function testHighlight() {
  const code = `
    <pre class="wp-block-code"><code class="language-typescript">console.log("Hello World");</code></pre>
  `;
  const highlighted = await highlightContent(code);
  console.log(highlighted);
}

testHighlight();
