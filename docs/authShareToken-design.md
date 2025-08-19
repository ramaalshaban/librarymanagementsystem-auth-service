# Service Design Specification - Object Design for authShareToken

**librarymanagementsystem-auth-service** documentation

## Document Overview

This document outlines the object design for the `authShareToken` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## authShareToken Data Object

### Object Overview

**Description:** A data object that stores the share tokens for tokenized access to shared objects.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property           | Type   | Required | Description                                                                                                          |
| ------------------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `configName`       | String | Yes      | A string value to represent the related configuration of the shared token.                                           |
| `objectName`       | String | Yes      | A string value to represent the type name of the shared object like `report`, `document`.                            |
| `objectId`         | ID     | Yes      | An ID value to represent the shared target data object instance.                                                     |
| `ownerId`          | ID     | Yes      | An ID value to represent the user who shared the object by creating this token.                                      |
| `peopleOption`     | String | Yes      | A string value to represent the access option of the share token. It can be either anyoneWithLink or specificEmails. |
| `tokenPermissions` |        | Yes      | A string array to store the names of permissions (or roles) by the sharing user.                                     |
| `allowedEmails`    |        | Yes      | A string array to store the allowed emails if the peopleOption is specificEmails.                                    |
| `expireDate`       | Date   | Yes      | A date value to specify the expire date of the token. Null for infinite token.                                       |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`configName` `objectName` `objectId` `ownerId` `peopleOption` `tokenPermissions` `allowedEmails` `expireDate`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Elastic Search Indexing

`configName` `objectName` `objectId` `ownerId` `peopleOption` `tokenPermissions` `allowedEmails` `expireDate`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`configName` `objectId` `ownerId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Session Data Properties

`ownerId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **ownerId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`configName` `objectName` `objectId` `ownerId` `peopleOption` `tokenPermissions` `allowedEmails` `expireDate`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **configName**: String has a filter named `configName`

- **objectName**: String has a filter named `objectName`

- **objectId**: ID has a filter named `objectId`

- **ownerId**: ID has a filter named `ownerId`

- **peopleOption**: String has a filter named `peopleOption`

- **tokenPermissions**: has a filter named `tokenPermissions`

- **allowedEmails**: has a filter named `allowedEmails`

- **expireDate**: Date has a filter named `expireDate`
