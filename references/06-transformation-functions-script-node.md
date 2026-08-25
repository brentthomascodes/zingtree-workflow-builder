# CX Actions: Transformation Functions and Script Node

Source: https://help.zingtree.com/hc/en-us/articles/36421095549467-CX-Actions-Transformation-Functions-and-Script-Node

CX Actions is a gated feature — access requires contacting a Zingtree Account Manager or Support.

## Transformation Functions

Transformation functions are a powerful feature of CX Actions that allow you to manipulate and transform data within workflows using JavaScript. They can leverage Workflow form data (key-value pairs) or Workflow actions data (dynamic data) to perform complex operations.

## Overview

Transformation functions are JavaScript-based functions used to transform data retrieved from **Connected Objects**, user-selected data, or transient data stored within the transformation namespace. They are invoked from a workflow using the **Script Node**, and results can be used in various nodes such as **Content Node**, **Email Node**, and all other places where CX Actions variable substitutions are allowed.

## Types of Transformation Functions

### System Functions

Predefined helper functions to work with, access, and update data. Accessible using the `ZT` namespace.

#### 1. Logging Messages

Logs a message to the console. Messages logged are stored in Execution Insights if logging is enabled in the Connected Object.

```
ZT.log("Transformation started");
```

#### 2. Setting Response Data

Sets the response data with the given alias.

```
ZT.setResponseData("customerInfo", { name: "John Doe", age: 30 });
```

#### 3. Setting View Data

Sets the view data with the given alias.

```
ZT.setViewData("selectedItem", { id: "123", name: "Laptop" });
```

#### 4. Setting Transformation Data

Sets the transform data with the given alias.

```
ZT.setTransformData("processedOrder", { orderId: "456", status: "Completed" });
```

#### 5. Setting Form Data

Sets the form data with the given alias.

```
ZT.setFormData("sumResult", sum);
```

#### 6. Retrieving a Variable Value

Retrieves the value of a variable if it is defined, otherwise returns a default value.

```
const currency = ZT.getVariableValue("preferredCurrency", "USD");
```

### Full System Function Signatures (verbatim from article)

```
log(message: string): void
ZT.log("Transformation started");

setResponseData(alias: string, data: any): void
ZT.setResponseData("customerInfo", { name: "John Doe", age: 30 });

setViewData(alias: string, data: any): void
ZT.setViewData("selectedItem", { id: "123", name: "Laptop" });

setTransformData(alias: string, data: any): void
ZT.setTransformData("processedOrder", { orderId: "456", status: "Completed" });

getVariableValue(name: string, defaultVal: any): any
const currency = ZT.getVariableValue("preferredCurrency", "USD");
```

*(Note: `ZT.setFormData(alias: string, data: any): void` follows the same pattern — the signature block in the article omits it, but the function is documented in item 5 above.)*

### User Functions

Custom JavaScript functions you define to perform specific data transformations. They can leverage system functions and namespaces. These functions are accessible using the `ZT` namespace (e.g., a defined `transformData` function is invoked as `ZT.transformData(...)`).

## Namespaces in Transformation Functions

Three main namespaces:

### Actions Namespace

The `actions` namespace contains data retrieved from connected objects, often referred to as response data — typically the result of an API call or other external data retrieval operation.

### Views Namespace

The `views` namespace contains data selected by the user — usually derived from user inputs or selections within the workflow.

### Transforms Namespace

The `transforms` namespace is used as a transient store for data being transformed. Results of transformation functions can be persisted into this namespace for later use.

## Accessing Data from Namespaces

### Content Node & Other UI Elements

Data from these namespaces can be accessed using the `${<namespace>.<alias>}` syntax in **Content Node** and other places.

**Examples:**
- `${actions.customerData.firstName}` – Retrieves response data from an external system.
- `${views.customerData.firstName}` – Accesses user-selected data.
- `${transforms.processedData}` – Retrieves transformed data.

### Script Node & Transformation Function

In the **Script Node** and Transformation Function, data can be accessed using `<namespace>.<alias>.xxx`. It is advisable to access data from the namespace in the Script Node.

```
// Accessing data from the actions namespace
const orderAmount = actions.orderInfo.totalAmount;

// Accessing data from the views namespace
const orderId = views.orderInfo.id;

// Accessing data from the transforms namespace
const transformedData = transforms.transformedData;
```

### Necessary Checks While Accessing Data

Ensure the data exists and is in the expected format:

```
// Basic check
if (actions && actions.orderInfo && actions.orderInfo.totalAmount) {
  const orderValue = actions.orderInfo.totalAmount;
  // ... proceed with logic
}

// Using optional chaining
const orderValue = actions?.orderInfo?.totalAmount;
if (orderValue) {
  // Use orderValue safely
}
```

## Using Transformation Functions in Workflows

Transformation functions are invoked from a workflow using the **Script Node**.

```
// Example Transformation Function
function transformData(responseData) {
  if (responseData.length === 0) {
    ZT.log('No response data found.');
    return [];
  }

  const transformedData = responseData.map(item => {
    return {
      ...item,
      newField: item.oldField * 2
    };
  });

  ZT.log('Data transformation completed successfully.');
}

// Access data and invoke transformation
const responseData = actions.responseAlias || [];
const transformedData = ZT.transformData(responseData);
ZT.setTransformData('transformedData', transformedData);
```

## Script Node

The **Script Node** allows users to write and execute JavaScript code snippets within workflows.

### Key Features of Script Node

1. **JavaScript Execution:** Write and execute JavaScript directly.
2. **Access to Namespaces:** Access `actions` and `views` data.
3. **Data Updates:** Update or set data across namespaces.
4. **Transformation Function Invocation:** Perform complex data operations.
5. **Seamless Integration:** Works with nodes like **Data Connected Node**, **Content Node**, and **Email Node**.

## Use Cases for Transformation Functions

### Data Enrichment

#### Use Case 1: Enriching Product Data

**Scenario:** Enrich product data with discounted price and availability.

```
function enrichProductData(products) {
  if (products.length === 0) {
    ZT.log('No product data found.');
    return [];
  }

  const enrichedProducts = products.map(product => {
    const discountedPrice = product.price * 0.9;
    const availability = product.stock > 0 ? 'In Stock' : 'Out of Stock';
    return { ...product, discountedPrice, availability };
  });

  ZT.log('Product data enrichment completed.');
}
```

#### Use Case 2: Create a New Variable in Form Data

**Scenario:** Perform a calculation or function and store the result as a new variable in Form Data.

```
// Convert stringSample to a number and add it to numberSample
var sum = Number(stringSample) + numberSample;

// Use ZT.setFormData to store the result
ZT.setFormData("sumResult", sum);
```

(Note: form-data variables like `stringSample` and `numberSample` are referenced directly in the Script Node without namespace traversal.)

#### Use Case 3: Adding Customer Segmentation

**Scenario:** Segment customers by purchase history.

```
function segmentCustomers(customers) {
  if (customers.length === 0) {
    ZT.log('No customer data found.');
    return [];
  }

  const segmentedCustomers = customers.map(customer => {
    const totalPurchases = customer.purchases.reduce((sum, p) => sum + p.amount, 0);
    let segment = 'Low Value';
    if (totalPurchases > 1000) segment = 'High Value';
    else if (totalPurchases > 500) segment = 'Medium Value';
    return { ...customer, totalPurchases, segment };
  });

  ZT.log('Customer segmentation completed.');
}
```

#### Use Case 4: Enriching Order Data with Shipping Information

```
function enrichOrderData(orders) {
  if (orders.length === 0) {
    ZT.log('No order data found.');
    return [];
  }

  const enrichedOrders = orders.map(order => {
    const shippingInfo = {
      estimatedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      shippingCarrier: 'Standard Shipping'
    };
    return { ...order, ...shippingInfo };
  });

  ZT.log('Order data enrichment completed.');
}
```

### Data Filtering

#### Use Case 5: Filtering Outdated Submissions

```
function filterSubmissions(submissions) {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

  if (submissions.length === 0) {
    ZT.log('No submissions found.');
    return[];
  }

  const filteredSubmissions = submissions.filter(sub => new Date(sub.date) > thirtyDaysAgo);
  ZT.log('Submissions filtered successfully.');
}
```

### Data Aggregation

#### Use Case 6: Aggregating Sales by Category

```
function aggregateSalesByCategory(sales) {
  if (sales.length === 0) {
    ZT.log('No sales data found.');
    return[];
  }

  const aggregatedSales = sales.reduce((acc, sale) => {
    const category = sale.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += sale.amount;
    return acc;
  }, {});

  ZT.log('Sales aggregated by category.');
}
```

## Conclusion

Transformation functions are a versatile tool for manipulating and transforming data within workflows. By leveraging system functions and namespaces, you can enrich, filter, or aggregate data.

For Data Enrichment and Merging data from different sources in CX Actions: create a Connected Object with sample data and generate a schema; a Dynamic View can then be created to effectively utilize the transformed data.
