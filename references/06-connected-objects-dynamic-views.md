# CX Actions: Universal External Sources, Connected Objects and Dynamic Views

Source: https://help.zingtree.com/hc/en-us/articles/31503573736219-CX-Actions-Universal-External-Sources-Connected-Objects-and-Dynamic-Views

## Introduction

The Universal Connector Framework allows Zingtree to integrate with external systems, whether standard or custom-built. Users can perform CRUD operations and other tasks by connecting to external services via HTTP interfaces (REST or otherwise).

CX Actions is a gated feature — access requires contacting a Zingtree Account Manager or Support.

## Components of the Universal Connector Framework

Designed for different user personas (Solution Architects and Authors).

1. **External Sources**
   - Provides authentication for accessing external systems and services.
   - Supports API Key, Basic Auth, Bearer Token, OAuth2, and more.
2. **Connected Objects**
   - Defines references to external objects or endpoints for use in flows.
   - Supports HTTP verbs: GET, POST, PUT, PATCH, DELETE.

## Setting Up External Sources

### Step 1: Define an External Source

Available connectors: the **Salesforce Connector** is specific to Salesforce; choose the **HTTP Connector** for all other sources.

1. Navigate to **Apps & Integrations > External Sources > Data Sources** in Zingtree.
2. Click **Add Source**.
3. Fill in:
   - **Name**: A unique identifier for the connection.
   - **Description**: (Optional) Details about the purpose of the connection.

### Step 2: Configure Authentication

Select the appropriate method:

- **API Key**:
  - Enter the API key and specify whether to include it in the header or query parameters.
  - Optionally provide a username if required by the external system.
- **Basic Auth**:
  - Input the username and password.
- **Bearer Token**:
  - Provide the token and optional prefix.
- **OAuth2**:
  - Choose between **Password Credentials** or **Client Credentials**.
  - Fill in fields like Access Token URL, Client ID, Client Secret, and Scope.
- **No Auth**: Coming soon.

## Configuring Connected Objects

Connected Objects are references to external endpoints used within workflows.

### Step 1: Create a Connected Object

1. Navigate to **Apps & Integrations > Connected Objects**.
2. Click **Add New Object**.
3. Enter:
   - **Name**: An identifier.
   - **Alias**: Generated from the name of the Connected Object. You can edit it manually, but the Alias must be unique. **Note:** once the Connected Object is created, the alias cannot be edited later.
   - **Description**: (Optional) Describe the object's functionality.
   - **Endpoint URL**: The full URL of the endpoint.

### Step 2: Set Up Request Parameters

- **Request Headers**: Add custom headers as needed.
- **Query Parameters**: Configure dynamic or static parameters for the request.

### Step 3: Define HTTP Methods

Connected Objects support:

- **Retrieve** (GET)
- **Create** (POST)
- **Update** (PUT)
- **Modify** (PATCH)
- **Delete** (DELETE)

## Using Connected Objects in Workflows

Use the **Data Connected Node** to:

1. Retrieve data from external systems.
2. Create or update records dynamically.
3. Display information in real-time during flows.

### Add a Data Connected Node

1. Add a new node to your workflow and choose the **Data Connected Node** type.
2. Configure it by selecting the name of your **Connected Object** from the drop-down list.
3. Select which node should be displayed next.

## Dynamic Views

Dynamic Views allow you to create a customized display of retrieved data for the end user.

### Step 1: Create a New Dynamic View

1. Navigate to **Apps & Integrations > Dynamic Views**.
2. Click **Add Dynamic View**.

### Step 2: Configure the General Settings

1. Enter:
   - **Name:** A unique name for the Dynamic View
   - **Description:** A description of the Dynamic View
2. Toggle the switch to **Active** if you wish to have this View available for Authors to use in **Content Nodes**.

### Step 3: Configure the Widget Settings

1. Select the **Connected Object** you'll be using to display the data. In the **Schema** section, select the records that you want included in the display.

### Step 4: Configure the Designer Settings

1. Choose display type — **Grid** or **Card**:
   - A Grid displays as a table of records.
   - A Card displays the records as individual cards.
2. Toggle options on/off:
   - **Searchable**: Allows the user to search the displayed records.
   - **Sortable:** Allows the user to sort the displayed records.
   - **Selectable:** Allows the user to select an individual record.
   - **Multi-Select:** Allows the user to select multiple records.
   - **Page Size:** The number of results to display per page.
3. Configure the order of your Fields — selected fields are listed in the **Fields** section; drag their handles into display order.
4. Save the configured Dynamic Display.

### Step 5: Adding your Dynamic View to a Content Node

Typically a Dynamic View is shown in a node following the **Data Connected Node**.

1. In a Content Node, choose the **Dynamic Views** button from the editor toolbar.
2. All Dynamic Views available to the Author are shown in the list; choose the View to display. **Note:** The Dynamic View is only available if the Connected Object it is tied to has been used in a workflow (current workflow or any other workflow in the organization).
3. Once added to the node, the View can be edited or removed by clicking inside the View's parameters.

## Syntax

Passing dynamic values in/from Actions uses a different syntax than standard Zingtree form data variables.

**Dynamic fields in Connected Objects:**

```
${varA}
```

**Variables returned from a Connected Object (whether in the authoring tool or a Connected Object):**

```
${actions.alias.fields[0].field_name}
```

**Variables returned from a selection made in Dynamic Views (whether in the authoring tool or a Connected Object):**

```
${views.alias.field_name}
```

**Variables in the authoring tool collected in form data fields or via the URL:**

```
#varA#
```

## Personas and Use Cases

- **Solution Architect**:
  - Designs and configures External Sources and Connected Objects.
  - Understands HTTP and security protocols.
- **Author**:
  - Uses Connected Objects to enhance workflow functionality.
  - Integrates external data dynamically into Zingtree flows.

## Additional Notes

- Data security is ensured with AES-256 encryption for sensitive credentials.
- Zingtree supports dynamic variable substitution using `{{ }}` syntax to customize parameters at runtime.
