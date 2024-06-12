# kontent.components

Prototype for Data-Driven Web Page Presentation Control with the kontent.ai CMS

## Introduction

This clog describes a prototype for data-driven web page presentation control using the Kontent.ai Content Management System (CMS).

For additional background information, see the following blog post:

- https://deliverystack.net/2024/05/25/proposal-for-generic-data-driven-web-page-presentation-control-with-content-management-systems/

## Overview

Modern web solutions compose web pages from reusable components that specify the data to present and how to present that content. This prototype allows CMS users to define web pages as collections of  CMS components. Each CMS component corresponds to a React presentation component and can specify content from the CMS or elsewhere for that React component to render. CMS components can specify presentation options such as the width and height of images in an image gallery or a treatment such a slider or thumbnails gallery. This prototype passes those options to the React components, which apply them while rendering HTML.

To summarize the approach:

- In the CMS, some records (sometimes called items, entries, or other terms depending on the product) represent pages.
- The content types for these page items contain fields that correspond to regions of the page layout. These fields let the CMS user select CMS Components to drop into those regions.
- Each CMS component corresponds to a React component and can specify presentation options for that React component as well as data for that React component to render.
- Some React components use data from the CMS; some may use data from other systems.

## Goals

The goals of this prototype include:

- Allow CMS users to assemble web pages from reusable components, where each component specifies both content and presentation.
- Maintain separation of content from presentation. This makes both content and presentation reusable.
- Reduce vendor-specifics by avoiding Software Development Kits (SDKs), limiting Webservice APIs used, and normalizing JSON formats.
- Minimize Webservice API calls to optimize performance.
- Maximize flexibility
- Optimize usability 
- Allow CMS users to define reusable HTML templates that can render content from any number of content items, which are records in the CMS, often called entries in other products.

## Warnings and Caveats

Some warnings and caveats about this prototype: 

- I am not a JavaScript programmer, nor do I know anything about React.
- To focus on data-driven presentation concepts, this prototype is intentionally simplified, meaning that it lacks any form of data validation or error control.
- To preview a CMS Component, the user needs to preview a page that uses that component. It should be possible to support previewing of individual components outside the context of a page, but this introduces coding complications that I didn’t care to address.
- I have never used kontent.ai before and didn’t read the documentation.
- This prototype assumes that the last segment of the requested URL path is the unique codename of an item in kontent.ai that contains data for a page. If that segment is empty, this prototype defaults its value to `home`, meaning that there should be an item in kontent.ai with `home` as its codename.
- I didn't investigate potential circular references using the `depth` query string parameter to the kontent.ai Webservice API as described in the **Kontent..ai Specifics** section of this clog.
- Breaking a page into multiple items requires the user to workflow and publish each of those items, where items can depend on other items.

## Why Kontent.ai 

With some modifications and limitations, the technique described in this clog should apply to any CMS that exposes content over Webservice APIs.
I used kontent.ai for the following reasons:

- I've heard good things about kontent.ai, which my minimal research and use have confirmed. 
- It was easy to obtain temporary free access to a Kontent.ai instance.
- I can retrieve a content item without knowing its content type (sometimes called a model in other CMS products) or its cryptic identifier unique .
- With a single Webservice API call, I can retrieve a item and the items that it references.
- The data structure used to represent a content item and the items that it references is relatively efficient, although that efficiency slightly complicates working with the JSON.

## Kontent.ai Specifics

Some information specific to kontent.ai:

- Kontent.ai provides **Content Type Snippets**, which are partial content types that multiple actual content types can use. This reduces the burden on developers, makes content types more consistent, and allows developers to implenent changes in a single place that affect multiple content types.
- The Webservice API used to retrieve an item from kontent.ai can include the referenced items, and in turn the items that those items reference, to the limit specifiedy by the `depth` query string paramter. When using this capability, the data from referenced items do not appear inline within the JSON representation of the item that contains the referencing fields, but under a separate `modular_content` key. This avoids unnecessary data duplication, which could happen if the page item or any item that it references in turn references another item twice), but makes accessing the referenced item data slightly more cumbersome. 

## Types of Content Types

This prototype includes four categories of content types:

- **Content Type Snippets** are partial content type definitions used by other content types.
- **Fragment** content types define fields used by presentation components, but unlike Page items, fragment items do not have their own URLs. 
- **RteTemplate** items contain a Rich Text Editor (RTE) field that can contain HTML that can contain handlebars templates. The prototype includes a React component that applies handlebars to an item from kontent.ai, allowing CMS users to define markup that wraps values from CMS items. URLs are not relevant to RteTemplate items.
- **CMS Component** content types represents a presentation component that CMS users can bind to a region in the layout for a page. URLs are not relevant to CnsComponent items.
- **Pages** represent web pages that can contain CMS Components, where that page has its own URL.

For information about handlebars templates, see:

- https://handlebarsjs.com/

## Usage

To use this prototype, the CMS user creates reusable content items using Fragment and Page content types. Then, the user creates reusable CMS Component items that specify one or more content items or images or other data and how to render that data. Finally, the user creates or updates Page entries to specify which CMS Components should populate regions in the layout for those pages.

## Content Type Snippets

This prototype uses the kontent.ai content type snippets described in the following sections.

### The CommonContent Content Type Snippet

For this prototype, any Page item or Fragment item must have at least a title, a description, and a primary image. Therefore, this prototype includes a CommonContent content type snippet that defines these three fields. All Page and Fragment content types use this content type snippet.

- **Title**: Text, required
- **Description**: Text, required.
- **MainImage**: Asset, exactly one, optional (or implement two snippets, one optional and one required).

### The **ContentComponent** Content Type Snippet

The **ContentComponent** content type snippet contains the ContentItem Linked item field that allows the CMS user to select an item. Multiple CMS Component content types use this content type snippet.

- **ContentItem**: Linked items, optional (or implement two snippets, one optional and one required), single item (any Page or Fragment content type).

## Content Types

This prototype uses the kontent.ai content types described in the following sections.

### The **PageContent** Content Type Snippet

The **PageContent** content type snippet contains the MainComponents Linked items field that lets the CMS user select CMS Component items to populate the main region of the layout for the page.

- **MainComponents**: Linked items (RteComponent, BannerComponent, ImageCollectionComponent, and other CMS Component content types)

### The SimplePage Page Content Type

The SimplePage content type is an example of a Page content type that includes the CommonContent content type snippet and the MainComponents content type snippet.

- **CommonContent** (content type snippet)
- **PageComponents** (content type snippet)

### The SimpleFragment Fragment Content Type

The SimpleFragment content type is an example of a Fragment content type that includes the CommonContent content type snippet.

- **CommonContent** (content type snippet)

### The **ImageCollection** Fragment Content Type

The **ImageCollection** content type is an example of a Fragment content type that does includes the ContentComponent content type snippet and the Images Asset field that lets the CMS user select some number of images.

- **ContentComponent** (content type snippet)
- **Images**: Asset, required

### The **RteTemplate** Content Type

The **RteTemplate** content type contains the RteTemplate Rich Text Editor (RTE) field that can contain HTML that can contain handlebars templates. 

- **RteTemplate**: Rich text, required

## CMS Component Content Types

This prototype includes the CMS Component content types described in the following sections.

### The **RteComponent** CMS Component Content Type

The **RteComponent** CMS Component content type contains the **ContentComponent** Content type snippet that contains the ContentItem Linked item field that lets the CMS user select a content item and the RteTemplate Linked items field that lets the CMS user select an RteTemplate item to use to render that content item.

- **ContentComponent** (content type snippet)
- **RteTemplate**: Linked item, required, single RteTemplate item.

### The **BannerComponent** CMS Component Content Type

The **BannerComponent** CMS component content type contains the ContentComponent content type snippet that contains the ContentItem Linked items field that lets the CMS user select a content item to render as a banner.

- **ContentComponent** content type snippet

### The **ImageCollectionComponent** CMS Component Content Type

The **ImageCollectionComponent** CMS Component content type contains the ImageItems Linked items field that lets the CMS user select some number of ImageCollection items to render.

- **Treatment**: Multiple choice, required,singe selection, create an option named "gallery"
- **ImageItems**: Linked item, required, ImageCollection content type
- **ImageHeight**: Number, required
- **ImageWidth**: Number, required

## Function Library

This prototype includes the `/src/lib.js` library that contains two functions.

### The `flattenItem()` Function

The `flattenItem()` function accepts a kontent.ai item as a parameter and returns an object with the same keys and values in a simplified structure.

//TODO: example

### The `getItem()` Function

The `getItem()` function accepts Kontent.ai codename as a parameter, uses the `fetch()` function to retrieve the specified item from kontent.ai, and returns a Promise that resolves to a Response as returned by that call to the `fetch()` function.

## React Components

Other than `CmsComponents.jsx`, `Stringify.jsx`, and `UseCmsItem.jsx`, each of the React components receives as parameters the kontent.ai item and a key that identifies the data in that item for the component to use.

### The `CmsBannerComponent.jsx` React Component

The `CmsBannerComponent.jsx` flattens the item and renders a banner using any Page or Fragment item as a data source.

[CmsBannerComponent.jsx](./src/components.CmsBannerComponent.jsx)

### The `CmsComponents.jsx` React Component

The `CmsComponents.jsx` React component receives as parameters the Kontent.ai item and the identifier of a field in that item that designates the CMS Components to invoke. It then iterates those CMS components and invokes the corresponding React components based on the content type of the CMS Component.

//TODO: Link

### The `CmsImagesComponent.jsx` React Component

The `CmsImagesComponent.jsx` React component renders the images specified in the CMS Component. 

//TODO: Link

### The `CmsRteComponent.jsx` React Component

The `CmsRteComponent.jsx` React component retrieves an RTE field value that may contain handlebars templates and uses the flattened kontent.ai item to render those templates.

//TODO: Link

### The `Stringify.jsx` React Component

The `Stringify.jsx` React retrieves component renders a raw JSON structure, which can be convenient while debugging.

//TODO: Link

### The `UseCmsItem.jsx` React Component

The `UseCmsItem.jsx` React Component provides an example of client-side code that uses the JSON representation of the item.

## The App

The `/src/App.js` application retrieves the kontent.ai item that has a codename that matches the last segment in the requested URL path or home if there is no such value. The app renders a `Loading…` message until the asynchronous `fetch()` function completes.

If no matching item exists in Kontent.ai, the app renders an error message. Otherwise, it passes the retrieved item and the identifier of one of its fields that contains CMS Components to the `CmsComponents` React component. It then uses the `Stringify` React component to render the raw JSON retrieved from of that item.

//TODO: Link

## Usage

1. Create content types and items.
2.

```sh
npx create-react-app kontent.components
gh repo clone deliverystack/kontent.components
cd kontent.components
npm install handlebars 
code . # At the very least, change token in /src/lib.js
npm start &
```
