# CX Actions: Namespaces: Accessing Data in Zingtree

Source: https://help.zingtree.com/hc/en-us/articles/41014766094491-CX-Actions-Namespaces-Accessing-Data-in-Zingtree
(Retrieved via Zendesk Help Center API; article last edited 2025-12-24.)

## Overview

Data in Zingtree exists across various **namespaces**. All dynamic data is organized and accessed through them, so understanding how namespaces work is essential.

CX Actions is a gated feature — access requires contacting a Zingtree Account Manager or Support.

## What Are Namespaces?

Namespaces in Zingtree are **organizational structures** that separate dynamic data from different sources, such as API requests, scripting, and dynamic views. They allow you to reference and update data without conflicts.

- **Default Namespace (Form Data)**: Variables created from query parameters or form fields live here. This namespace is implicit — referenced directly without object traversal.
- **Transforms Namespace**: Stores variables created and manipulated through scripting.
- **Actions Namespace**: Holds API response data from **CX Actions**.
- **Dynamic Views Namespace**: Holds data selected from Dynamic Views.

All namespace and form data is also available on the immutable `this` object, which can be logged for debugging.

## Cache TTL and Persistence

**Cache TTL**
- The `actions` and `views` namespaces use the Cache TTL (in seconds) configured on the connected objects.
- The `transformations` (transforms) namespace has a **fixed TTL of 1 hour**.
- The form-data (global) namespace does **not** use any TTL.

**Data Persistence**
- The **Log Activity** toggle in Connected Objects controls whether request and response data from connected objects is persisted.

## Form Data (Default Namespace)

Form data is created from **query parameters** or **form fields** in content nodes.

- Lives in the **default namespace** (no object traversal required).
- Referenced directly as a variable:

```
${myVariable}
```

**Limitation:**
- Form data cannot be set programmatically *(note: per the Transformation Functions article, `ZT.setFormData()` does set form-data variables from scripts; this article states form fields themselves cannot be pre-set)*
- Form fields cannot have a pre-set/default value.

## Transforms Namespace (Scripting)

The **transforms** namespace is used to store and manipulate scripting variables.

### Defining and Storing Variables

```
// Define a variable
let myActivity = { activity_name: "sample name value" };

// Store variable in transforms namespace for later reference
ZT.setTransformData("myActivity", myActivity);
```

### Referencing Variables

```
// Reference entire variable
transforms.myActivity

// Reference a nested value
transforms.myActivity.activity_name
```

- Any valid **JSON structure** can be stored in the transforms namespace.
- Useful for preparing data before passing it to workflows or logic nodes.

## Actions Namespace (API Responses)

The **actions** namespace stores all data returned from a **CX Action (API Response)**.

### Referencing API Response Data

In a content node:

```
${actions.CONNECTED_OBJECT_ALIAS.xyz}
```

In scripting:

```
let response = actions.get_activity.name;
```

### Enriching and Storing API Data

```
// Create new object with API response data
let myActivity = { 
  activity_name: actions.get_activity.name, 
  other_key: "some other value" 
};

// Store enriched object for later reference
ZT.setTransformData("myActivity", myActivity);
```

**Tip:** Perform business logic on API responses in a script node and store any new data into a transforms namespace variable. This keeps API responses immutable and ensures cleaner workflows.

## Dynamic Views Namespace

The **views** namespace is used for data selected from a **Dynamic View**.

- Similar in structure to the actions namespace.
- Data is referenced by traversing the Connected Object path.
- If the Dynamic View used multi-select, you also need to traverse the proper array name:

```
// single-select object traversal: views.CONNECTED_OBJECT_ALIAS.xyz
// multi-select object traversal: views.CONNECTED_OBJECT_ALIAS.records[0].xyz
```

## The `this` Object

All data (form data and namespace data) is also available on the **immutable** `this` object. You can inspect it in a script node:

```
ZT.log(this);
```

This allows you to validate and debug the full scope of data available at any step in your workflow.

**Limitation:** You cannot update data directly on the immutable `this` object.

```
// will not work: this.transforms.myVariable = "updated value"
// will not work: this.myVariable = "updated value"
```
