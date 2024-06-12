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

## CMS User Usage

To use this prototype, the CMS user creates reusable content items using Fragment and Page content types. Then, the user creates reusable CMS Component items that specify one or more content items or images or other data and how to render that data. Finally, the user creates or updates Page entries to specify which CMS Components should populate regions in the layout for those pages.

## Content Type Snippets

This prototype uses the kontent.ai content type snippets described in the following sections.

### The CommonContent Content Type Snippet

For this prototype, any Page item or Fragment item must have at least a title, a description, and a primary image. Therefore, this prototype includes a CommonContent content type snippet that defines these three fields. All Page and Fragment content types use this content type snippet.

- **Title**: Text, required
- **Description**: Text, required.
- **MainImage**: Asset, exactly one, optional (or implement two snippets, one optional and one required).

```json
{
  "item": {
    "elements": {
      "commoncontent__title": {
        "type": "text",
        "name": "Title",
        "value": "Home Page Title"
      },
      "commoncontent__description": {
        "type": "text",
        "name": "Description",
        "value": "Home Page Description"
      },
      "commoncontent__mainimage": {
        "type": "asset",
        "name": "MainImage",
        "value": [
          {
            "name": "photo-1574068468668-a05a11f871da.jpg",
            "description": null,
            "type": "image/jpeg",
            "size": 871156,
            "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
            "width": 2250,
            "height": 4000,
            "renditions": {}
          }
        ]
      },
      //...
    }
    //...
  }
  //...
}
```

### The **ContentComponent** Content Type Snippet

The **ContentComponent** content type snippet contains the ContentItem Linked item field that allows the CMS user to select an item. Multiple CMS Component content types use this content type snippet.

- **ContentItem**: Linked items, optional (or implement two snippets, one optional and one required), single item (any Page or Fragment content type).

```json
 "elements": {
        "contentcomponent__contentitem": {
          "type": "modular_content",
          "name": "ContentItem",
          "value": [
            "home"
          ]
        }
      }
      //...
```

## Content Types

This prototype uses the kontent.ai content types described in the following sections.

### The **PageContent** Content Type Snippet

The **PageContent** content type snippet contains the MainComponents Linked items field that lets the CMS user select CMS Component items to populate the main region of the layout for the page.

- **MainComponents**: Linked items (RteComponent, BannerComponent, ImageCollectionComponent, and other CMS Component content types)

```json
"elements": {
  "commoncontent__title": {
    "type": "text",
    "name": "Title",
    "value": "Home Page Title"
  },
  "commoncontent__description": {
    "type": "text",
    "name": "Description",
    "value": "Home Page Description"
  },
  "commoncontent__mainimage": {
    "type": "asset",
    "name": "MainImage",
    "value": [
      {
        "name": "photo-1574068468668-a05a11f871da.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 871156,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
        "width": 2250,
        "height": 4000,
        "renditions": {}
      }
    ]
  },
  "pagecontent__maincomponents": {
    "type": "modular_content",
    "name": "MainComponents",
    "value": [
      "first_image_collection_component",
      "first_banner_component",
      "first_rte_component"
    ]
  }
  //...
}
```      

### The SimplePage Page Content Type

The SimplePage content type is an example of a Page content type that includes the CommonContent content type snippet and the MainComponents content type snippet.

- **CommonContent** (content type snippet)
- **PageComponents** (content type snippet)

```json
"elements": {
  "commoncontent__title": {
    "type": "text",
    "name": "Title",
    "value": "Home Page Title"
  },
  "commoncontent__description": {
    "type": "text",
    "name": "Description",
    "value": "Home Page Description"
  },
  "commoncontent__mainimage": {
    "type": "asset",
    "name": "MainImage",
    "value": [
      {
        "name": "photo-1574068468668-a05a11f871da.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 871156,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
        "width": 2250,
        "height": 4000,
        "renditions": {}
      }
    ]
  },
  "pagecontent__maincomponents": {
    "type": "modular_content",
    "name": "MainComponents",
    "value": [
      "first_image_collection_component",
      "first_banner_component",
      "first_rte_component"
    ]
  }
  //...
}
```      

### The SimpleFragment Fragment Content Type

The SimpleFragment content type is an example of a Fragment content type that includes the CommonContent content type snippet.

- **CommonContent** (content type snippet)

### The **ImageCollection** Fragment Content Type

The **ImageCollection** content type is an example of a Fragment content type that does includes the ContentComponent content type snippet and the Images Asset field that lets the CMS user select some number of images.

- **ContentComponent** (content type snippet)
- **Images**: Asset, required

```json
"elements": {
  "contentcomponent__contentitem": {
    "type": "modular_content",
    "name": "ContentItem",
    "value": []
  },
  "images": {
    "type": "asset",
    "name": "Images",
    "value": [
      {
        "name": "photo-1516233758813-a38d024919c5.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 97726,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/b54c53aa-cb43-4fd3-bd09-d5b3dc53f0f1/photo-1516233758813-a38d024919c5.jpg",
        "width": 800,
        "height": 1199,
        "renditions": {}
      },
      {
        "name": "photo-1574068468668-a05a11f871da.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 871156,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
        "width": 2250,
        "height": 4000,
        "renditions": {}
      }
    ]
  }
  //...
}
```

### The **RteTemplate** Content Type

The **RteTemplate** content type contains the RteTemplate Rich Text Editor (RTE) field that can contain HTML that can contain handlebars templates. 

- **RteTemplate**: Rich text, required

```json
"elements": {
  "rtetemplate": {
    "type": "rich_text",
    "name": "RteTemplate",
    "images": {},
    "links": {},
    "modular_content": [],
    "value": "<h3>{{{commoncontent__title}}}</h3>\n<p>{{{commoncontent__description}}}</p>"
  }
  //...
}
```

## CMS Component Content Types

This prototype includes the CMS Component content types described in the following sections.

### The **RteComponent** CMS Component Content Type

The **RteComponent** CMS Component content type contains the **ContentComponent** Content type snippet that contains the ContentItem Linked item field that lets the CMS user select a content item and the RteTemplate Linked items field that lets the CMS user select an RteTemplate item to use to render that content item.

- **ContentComponent** (content type snippet)
- **RteTemplate**: Linked item, required, single RteTemplate item.

```json
"elements": {
  "contentcomponent__contentitem": {
    "type": "modular_content",
    "name": "ContentItem",
    "value": [
      "home"
    ]
  },
  "rtetemplate": {
    "type": "modular_content",
    "name": "RteTemplate",
    "value": [
      "first_rte_template"
    ]
  }
  //...
}
```

### The **BannerComponent** CMS Component Content Type

The **BannerComponent** CMS component content type contains the ContentComponent content type snippet that contains the ContentItem Linked items field that lets the CMS user select a content item to render as a banner.

- **ContentComponent** content type snippet

```json
"elements": {
    "contentcomponent__contentitem": {
      "type": "modular_content",
      "name": "ContentItem",
      "value": [
        "home"
      ]
    }
    //...
}
```

### The **ImageCollectionComponent** CMS Component Content Type

The **ImageCollectionComponent** CMS Component content type contains the ImageItems Linked items field that lets the CMS user select some number of ImageCollection items to render.

- **Treatment**: Multiple choice, required,singe selection, create an option named "gallery"
- **ImageItems**: Linked item, required, ImageCollection content type
- **ImageHeight**: Number, required
- **ImageWidth**: Number, required

```json
"elements": {
  "contentcomponent__contentitem": {
    "type": "modular_content",
    "name": "ContentItem",
    "value": []
  },
  "images": {
    "type": "asset",
    "name": "Images",
    "value": [
      {
        "name": "photo-1516233758813-a38d024919c5.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 97726,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/b54c53aa-cb43-4fd3-bd09-d5b3dc53f0f1/photo-1516233758813-a38d024919c5.jpg",
        "width": 800,
        "height": 1199,
        "renditions": {}
      },
      {
        "name": "photo-1636246441747-7d7f83f4629c.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 112254,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/36d99871-307b-4674-9c4a-b10f8c885f93/photo-1636246441747-7d7f83f4629c.jpg",
        "width": 800,
        "height": 1200,
        "renditions": {}
      }
    ]
  }
  //...
}
```

## Function Library

This prototype includes the `/src/lib.js` library that contains two functions.

[lib.js](./src/lib.js)

### The `flattenItem()` Function

The `flattenItem()` function accepts a kontent.ai item as a parameter and returns an object with the same keys and values in a simplified structure.

Example Input:

```json
"system": {
  "id": "270a6b85-d95d-4863-96ed-6040188227d8",
  "name": "Home",
  "codename": "home",
  "language": "default",
  "type": "simplepage",
  "collection": "default",
  "sitemap_locations": [],
  "last_modified": "2024-06-12T21:11:31.4612268Z",
  "workflow": "default",
  "workflow_step": "published"
},
"elements": {
  "commoncontent__title": {
    "type": "text",
    "name": "Title",
    "value": "Home Page Title"
  },
  "commoncontent__description": {
    "type": "text",
    "name": "Description",
    "value": "Home Page Description"
  },
  "commoncontent__mainimage": {
    "type": "asset",
    "name": "MainImage",
    "value": [
      {
        "name": "photo-1574068468668-a05a11f871da.jpg",
        "description": null,
        "type": "image/jpeg",
        "size": 871156,
        "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
        "width": 2250,
        "height": 4000,
        "renditions": {}
      }
    ]
  },
  "pagecontent__maincomponents": {
    "type": "modular_content",
    "name": "MainComponents",
    "value": [
      "first_image_collection_component",
      "first_banner_component",
      "first_rte_component"
    ]
  }
}
//...
```

Example Output:

```json
{
  "commoncontent__title": "Home Page Title",
  "commoncontent__mainimage": [
      {
      "name": "photo-1574068468668-a05a11f871da.jpg",
      "description": null,
      "type": "image/jpeg",
      "size": 871156,
      "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
      "width": 2250,
      "height": 4000,
      "renditions": {}
      }
  ],
  "pagecontent__maincomponents": [
        "first_image_collection_component",
        "first_banner_component",
        "first_rte_component"
  ]
  //...
}
```

### The `getItem()` Function

The `getItem()` function accepts Kontent.ai codename as a parameter, uses the `fetch()` function to retrieve the specified item from kontent.ai, and returns a Promise that resolves to a Response as returned by that call to the `fetch()` function.

## React Components

Other than `CmsComponents.jsx`, `Stringify.jsx`, and `UseCmsItem.jsx`, each of the React components receives as parameters the kontent.ai item and a key that identifies the data in that item for the component to use.

### The `CmsBannerComponent.jsx` React Component

The `CmsBannerComponent.jsx` flattens the item and renders a banner using any Page or Fragment item as a data source.

[CmsBannerComponent.jsx](./src/components/CmsBannerComponent.jsx)

### The `CmsComponents.jsx` React Component

The `CmsComponents.jsx` React component receives as parameters the Kontent.ai item and the identifier of a field in that item that designates the CMS Components to invoke. It then iterates those CMS components and invokes the corresponding React components based on the content type of the CMS Component.

[CmsComponents.jsx](./src/components/CmsComponents.jsx)

### The `CmsImagesComponent.jsx` React Component

The `CmsImagesComponent.jsx` React component renders the images specified in the CMS Component. 

[CmsImagesComponent.jsx](./src/components/CmsImagesComponent.jsx)

### The `CmsRteComponent.jsx` React Component

The `CmsRteComponent.jsx` React component retrieves an RTE field value that may contain handlebars templates and uses the flattened kontent.ai item to render those templates.

[CmsRteComponent.jsx](./src/components/CmsRteComponent.jsx)

### The `Stringify.jsx` React Component

The `Stringify.jsx` React retrieves component renders a raw JSON structure, which can be convenient while debugging.

[Stringify.jsx](./src/components/Stringify.jsx)

### The `UseCmsItem.jsx` React Component

The `UseCmsItem.jsx` React Component provides an example of client-side code that uses the JSON representation of the item.

[UseCmsItem.jsx](./src/components/UseCmsItem.jsx)

## The App

The `/src/App.js` application retrieves the kontent.ai item that has a codename that matches the last segment in the requested URL path or home if there is no such value. The app renders a `Loading…` message until the asynchronous `fetch()` function completes.

If no matching item exists in Kontent.ai, the app renders an error message. Otherwise, it passes the retrieved item and the identifier of one of its fields that contains CMS Components to the `CmsComponents` React component. It then uses the `Stringify` React component to render the raw JSON retrieved from of that item.

[App.js](./src/App.js)

## Example Page Item

This JSON represents an example kontent.aipage item that includes data to drive page presentation.

```json
{
  "item": {
    "system": {
      "id": "270a6b85-d95d-4863-96ed-6040188227d8",
      "name": "Home",
      "codename": "home",
      "language": "default",
      "type": "simplepage",
      "collection": "default",
      "sitemap_locations": [],
      "last_modified": "2024-06-12T21:11:31.4612268Z",
      "workflow": "default",
      "workflow_step": "published"
    },
    "elements": {
      "commoncontent__title": {
        "type": "text",
        "name": "Title",
        "value": "Home Page Title"
      },
      "commoncontent__description": {
        "type": "text",
        "name": "Description",
        "value": "Home Page Description"
      },
      "commoncontent__mainimage": {
        "type": "asset",
        "name": "MainImage",
        "value": [
          {
            "name": "photo-1574068468668-a05a11f871da.jpg",
            "description": null,
            "type": "image/jpeg",
            "size": 871156,
            "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
            "width": 2250,
            "height": 4000,
            "renditions": {}
          }
        ]
      },
      "pagecontent__maincomponents": {
        "type": "modular_content",
        "name": "MainComponents",
        "value": [
          "first_image_collection_component",
          "first_banner_component",
          "first_rte_component"
        ]
      }
    }
  },
  "modular_content": {
    "first_banner_component": {
      "system": {
        "id": "5aaa5cbe-99bc-48ae-a60e-d99eeeb2d9ce",
        "name": "First Banner Component",
        "codename": "first_banner_component",
        "language": "default",
        "type": "bannercomponent",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-12T20:53:44.2164048Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "contentcomponent__contentitem": {
          "type": "modular_content",
          "name": "ContentItem",
          "value": [
            "home"
          ]
        }
      }
    },
    "first_image_collection": {
      "system": {
        "id": "82b7023a-4773-495a-bf2b-bba575845c6e",
        "name": "First Image Collection",
        "codename": "first_image_collection",
        "language": "default",
        "type": "imagecollection",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-10T21:59:21.446661Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "contentcomponent__contentitem": {
          "type": "modular_content",
          "name": "ContentItem",
          "value": []
        },
        "images": {
          "type": "asset",
          "name": "Images",
          "value": [
            {
              "name": "photo-1516233758813-a38d024919c5.jpg",
              "description": null,
              "type": "image/jpeg",
              "size": 97726,
              "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/b54c53aa-cb43-4fd3-bd09-d5b3dc53f0f1/photo-1516233758813-a38d024919c5.jpg",
              "width": 800,
              "height": 1199,
              "renditions": {}
            },
            {
              "name": "photo-1574068468668-a05a11f871da.jpg",
              "description": null,
              "type": "image/jpeg",
              "size": 871156,
              "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
              "width": 2250,
              "height": 4000,
              "renditions": {}
            }
          ]
        }
      }
    },
    "first_image_collection_component": {
      "system": {
        "id": "b3ea6903-03d1-4bf0-82b3-1a6c9ccd86f7",
        "name": "First Image Collection Component",
        "codename": "first_image_collection_component",
        "language": "default",
        "type": "imagecollectioncomponent",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-12T20:19:13.6520762Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "imageitems": {
          "type": "modular_content",
          "name": "ImageItems",
          "value": [
            "second_image_collection",
            "first_image_collection"
          ]
        },
        "treatment": {
          "type": "multiple_choice",
          "name": "Treatment",
          "value": [
            {
              "name": "gallery",
              "codename": "gallery"
            }
          ]
        },
        "imageheight": {
          "type": "number",
          "name": "ImageHeight",
          "value": 150
        },
        "imagewidth": {
          "type": "number",
          "name": "ImageWidth",
          "value": 150
        }
      }
    },
    "first_rte_component": {
      "system": {
        "id": "dd742464-a287-4869-a9ed-4203075f9781",
        "name": "First RTE Component",
        "codename": "first_rte_component",
        "language": "default",
        "type": "rtecomponent",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-12T21:11:07.5659418Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "contentcomponent__contentitem": {
          "type": "modular_content",
          "name": "ContentItem",
          "value": [
            "home"
          ]
        },
        "rtetemplate": {
          "type": "modular_content",
          "name": "RteTemplate",
          "value": [
            "first_rte_template"
          ]
        }
      }
    },
    "first_rte_template": {
      "system": {
        "id": "ddee4b00-32f5-4178-8ec5-eefd4b989fcf",
        "name": "First RTE Template",
        "codename": "first_rte_template",
        "language": "default",
        "type": "rtetemplate",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-12T21:29:08.9919227Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "rtetemplate": {
          "type": "rich_text",
          "name": "RteTemplate",
          "images": {},
          "links": {},
          "modular_content": [],
          "value": "<h3>{{{commoncontent__title}}}</h3>\n<p>{{{commoncontent__description}}}</p>"
        }
      }
    },
    "home": {
      "system": {
        "id": "270a6b85-d95d-4863-96ed-6040188227d8",
        "name": "Home",
        "codename": "home",
        "language": "default",
        "type": "simplepage",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-12T21:11:31.4612268Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "commoncontent__title": {
          "type": "text",
          "name": "Title",
          "value": "Home Page Title"
        },
        "commoncontent__description": {
          "type": "text",
          "name": "Description",
          "value": "Home Page Description"
        },
        "commoncontent__mainimage": {
          "type": "asset",
          "name": "MainImage",
          "value": [
            {
              "name": "photo-1574068468668-a05a11f871da.jpg",
              "description": null,
              "type": "image/jpeg",
              "size": 871156,
              "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/87dccfda-3798-476b-8128-cee6b37c82f6/photo-1574068468668-a05a11f871da.jpg",
              "width": 2250,
              "height": 4000,
              "renditions": {}
            }
          ]
        },
        "pagecontent__maincomponents": {
          "type": "modular_content",
          "name": "MainComponents",
          "value": [
            "first_image_collection_component",
            "first_banner_component",
            "first_rte_component"
          ]
        }
      }
    },
    "second_image_collection": {
      "system": {
        "id": "3d2b6289-ebb4-4dfb-91e8-7da6a7a9dc85",
        "name": "Second Image Collection",
        "codename": "second_image_collection",
        "language": "default",
        "type": "imagecollection",
        "collection": "default",
        "sitemap_locations": [],
        "last_modified": "2024-06-10T22:00:08.5646537Z",
        "workflow": "default",
        "workflow_step": "published"
      },
      "elements": {
        "contentcomponent__contentitem": {
          "type": "modular_content",
          "name": "ContentItem",
          "value": []
        },
        "images": {
          "type": "asset",
          "name": "Images",
          "value": [
            {
              "name": "photo-1516233758813-a38d024919c5.jpg",
              "description": null,
              "type": "image/jpeg",
              "size": 97726,
              "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/b54c53aa-cb43-4fd3-bd09-d5b3dc53f0f1/photo-1516233758813-a38d024919c5.jpg",
              "width": 800,
              "height": 1199,
              "renditions": {}
            },
            {
              "name": "photo-1636246441747-7d7f83f4629c.jpg",
              "description": null,
              "type": "image/jpeg",
              "size": 112254,
              "url": "https://assets-us-01.kc-usercontent.com:443/97d53770-a796-0065-c458-d65e6dcfc537/36d99871-307b-4674-9c4a-b10f8c885f93/photo-1636246441747-7d7f83f4629c.jpg",
              "width": 800,
              "height": 1200,
              "renditions": {}
            }
          ]
        }
      }
    }
  }
}
```
## Developer Usage

1. Create required content types and items in a kontent.ai project.
2. Copy the access token for the kontent.ai project.
3. Run the following commands:

```sh
gh repo clone deliverystack/kontent.components
cd kontent.components
npm install handlebars 
code . # At the very least, change the access token in /src/lib.js
npm start &
```
