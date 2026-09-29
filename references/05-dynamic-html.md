# Dynamic HTML

Source: https://help.zingtree.com/hc/en-us/articles/51590692872859-Dynamic-HTML

**House rules on top of the article (Sep 2026):**

- Write rendered HTML to **transforms** — `ZT.setTransformData("ticket_card_html", html)` — and render it with `${transforms.ticket_card_html}`, as the article's own examples do. A form-data merge dropped `zt-data` checkbox inputs on a live Corpay UK screen and turns newlines into `<br>` (`02-data-and-namespaces.md` → "Rendered HTML goes to transforms"; supersedes the brief "HTML to form data" rule).
- **Collapse the string to one line** before storing it: `html.replace(/\s*\n\s*/g, " ")`.
- Dynamic HTML is for **display** and for **per-item datasets that need an input per row** (`zt-data` inputs with unique names). Standard inputs — including a select whose options come from data, and any Yes/No check the agent must answer — are native form fields (`patterns.md` → "Native form fields"). `zt-data` selects render unstyled, cannot enforce `required`, and `zt-data` checkboxes rendered without their tick boxes on about every other live case.
- Build the string with template literals from the item objects. Escape only external free text shown as text (a customer's email, an API error body), with one small helper in the renderer that needs it. No `<style>`/`<script>` blocks in content (client-side JS is disabled in rendered content; some sanitizers strip markup after a `<style>` block) — inline styles, or classes from the managed stylesheet. Tree-level `script_code` is where UI behaviour lives (field hiding, a filtered second select).
- **Never put a merge field inside an attribute** of content-node HTML: Zingtree wraps merge output in a `<span>`, so `href="${url}"` breaks. Build the whole tag in the script.
- Interactive widgets on a screen (feedback thumbs) change state on the screen and write into a hidden **native** field from `script_code`; they never navigate (`do_button_click(<node id>)` restarted a journey once the screen was reachable from two paths).
- Stitch-back reads use the unquoted dynamic name: `ZT.getVariableValue("qty_" + item.id, 0)` (snake_case; the article below uses `qty-`).

*Below this line is the platform article, kept verbatim for its patterns. Where its examples use `<style>` blocks, `console.log`, `setFormData` for HTML or loop state in transforms, the house rules above win.*

Dynamic HTML lets you turn live workflow data into polished, interactive interfaces — styled tables, product cards, custom forms — without leaving Zingtree. Instead of static content, agents and end users see exactly what's relevant to them, generated in real time from data already flowing through the workflow.

## Why Teams Love This Pattern

- **No external tools required.** Everything happens inside a Script Node and a Content Node — no embeds, no iframes, no separate front-end to maintain.
- **Build it once, reuse it everywhere.** A well-built HTML component becomes a reusable building block across workflows.
- **Capture richer input.** Dynamic forms let users interact with each item in a dataset individually — quantities, selections, confirmations — and feed those values right back into workflow logic.

If you can describe it in HTML and CSS, you can render it in a workflow.

## Core Idea

Use a Zingtree **Script Node** to generate dynamic HTML from workflow data, and render it in a **Content Node**.

## Use Case Scenarios

- Display arrays or lists of data in customized and styled HTML elements
- Capture unique values for any fields for each object in the array
- Create dynamic tables and cards using custom HTML and CSS designs
- Create dynamic HTML form inputs
- Build reusable custom UI components directly inside workflows

## The Basic Pattern

1. In a **Script Node**, build an HTML string, including custom HTML, styling, and form inputs.
2. Save the HTML using `ZT.setTransformData("custom_html", html_variable_name)`.
3. Render it in a **Content Node** using `${transforms.custom_html}`.

### Example

```
let object = {
  id: 1,
  name: "Example Item",
  description: "This is an example description.",
  qty: 0
};

let html_string = `
<style>...custom css here...</style>

<div class="item-card">
  <h3>${object.name}</h3>
  <p><span class="item-label">ID:</span> ${object.id}</p>
  <p><span class="item-label">Description:</span> ${object.description}</p>
  <p><span class="item-label">Quantity:</span> ${object.qty}</p>
</div>
`;

ZT.setTransformData("custom_html", html_string);
```

### Display the HTML in a Content Node

```
${transforms.custom_html}
```

## The Array List Pattern

1. Retrieve array data from `transforms` or `actions`.
2. Iterate over the array.
3. In a **Script Node**, build an HTML string with custom HTML, styling, and form inputs.
4. Save using `ZT.setTransformData("custom_html", html_variable_name)` (house rule: transforms, not form data). *(Note: the article's steps say `ZT.setFormData` here, but the accompanying code example uses `ZT.setTransformData` and renders via `${transforms.custom_html}`.)*
5. Render in a **Content Node** using `${transforms.custom_html}`.

### Example

```
let items = [
  {
    id: 1,
    name: "Example Item 1",
    description: "First example description.",
    qty: 0
  }
];

let styled_items = items.map(item => {
  return `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.qty}</td>
    </tr>
  `;
});

let html_string = `
<style>...custom css here...</style>

<table class="items-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Description</th>
      <th>Qty</th>
    </tr>
  </thead>
  <tbody>
    ${styled_items}
  </tbody>
</table>
`;

ZT.setTransformData("custom_html", html_string);
```

## The Form Data Pattern

1. Retrieve array data from `transforms` or `actions`.
2. Iterate over the array.
3. In a **Script Node**, build HTML form inputs dynamically.
   - Ensure each input includes `class="zt-data"`.
   - Ensure each input includes `name="variable_name"`.
4. Save using `ZT.setTransformData("custom_html", html_variable_name)` (house rule: transforms, not form data).
5. Render in a **Content Node** using `${transforms.custom_html}`.

### Script - Create HTML

```
let items = [
  {
    id: 1,
    name: "Example Item 1",
    description: "First example description.",
    qty: 0
  }
];

let dynamic_form = items.map(item => {
  return `
    <tr>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>
        <input
          type="number"
          min="0"
          class="zt-data"
          name="qty-${item.id}"
          value="0"
        />
      </td>
    </tr>
  `;
});

let html_string = `
<style>...custom css here...</style>

<div class="zt-table-wrapper">
  <table class="zt-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${dynamic_form}
    </tbody>
  </table>
</div>
`;

ZT.setFormData('custom_html', html_string);
```

### Content - Display HTML

```
${transforms.custom_html}
```

### Script - Stitch Form Data

```
let items = [
  {
    id: 1,
    name: "Example Item 1",
    description: "First example description.",
    qty: 0
  }
];

/*
Iterate the dataset
Retrieve the value from each dynamic input
Store the selected qty back onto the object
*/

items.forEach(item => {

  // Input name created earlier:
  // name="qty-${item.id}"

  const qty = ZT.getVariableValue(
    `qty-${item.id}`,
    0
  );

  // Store selected value back onto object

  item.qty = qty;

});

/*
Final dataset now contains
the selected qty values
*/

ZT.setTransformData(
  "updated_items",
  items
);

console.log(items);
```

## Accessing Simple Values from Custom HTML Inputs

Custom HTML inputs can be accessed anywhere later in the workflow using:

```
ZT.getVariableValue(<HTML_ELEMENT_NAME>, <FALLBACK_VALUE>)
```

This allows dynamically generated HTML inputs to behave like standard Zingtree form fields.

### Example

Accessing the quantity selected from the standard table example:

```
const qty = ZT.getVariableValue('qty-product_id_1', 0);
```

You can then save that selected value using:

```
ZT.setFormData('selected_qty', qty);
```

This retrieves the selected quantity from:

```
<input name="qty-product_id_1" />
```

## Accessing Complex Values (Arrays or Lists)

This works because the generated HTML inputs used:

```
<input name=`qty-${item.id}` />
```

Then a **Script Node** can dynamically reference this unique `name` attribute on the HTML form input:

```
let items = [
  {
    id: 1,
    name: "Example Item 1",
    description: "First example description.",
    qty: 0
  }
];

items.forEach(item => {
  let qty = ZT.getVariableValue(`qty-${item.id}`, 0)
  items[item.id].qty = qty;
})

ZT.setTransformData("items", items)
```

The workflow can then reconstruct the final dataset using the selected values from each dynamically generated HTML element.

## Mental Model

Think of the **Script Node** as the renderer.

- The **Script Node** answers: *What HTML should this user see based on the data we have right now?*
- The **Content Node** answers: *Where should that generated HTML appear?*

Keep logic in the **Script Node** and presentation in the **Content Node**.

## Key requirements summary

- Dynamic form inputs must have `class="zt-data"` and a unique `name` attribute to be captured as workflow form data.
- Read captured input values later with `ZT.getVariableValue(name, fallback)`.
- Store generated HTML with `ZT.setTransformData(...)` and render via `${transforms.custom_html}` (house rule: never form data).
