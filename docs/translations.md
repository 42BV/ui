---
layout: default
title: Translations
description: 'Translations within @42.nl/ui.'
permalink: /translations
nav_order: 4
---

## Translations

Within the `@42.nl/ui` we support translating every text that the
library renders. By default however every text has a `fallback` text
which is in english. This way there is always a text for the user
to see.

There are two ways to `translate` or `override` these default text.

### Overriding

All components provide a `text` property containing all text which
the component renders. For example:

```ts
<Pager
  page={page}
  onChange={action('page changed')}
  text={{ next: 'Volgende', previous: 'Vorige' }}
/>
```

Here we use the `text` property to override the `next` and `previous`
text on the `Pager` component. When you override a text it should
be translated already.

### Translating

Another option would be to provide your own `translator` function.
All texts are by default translated before they are rendered, by
default the `fallback` language is rendered.

Here is an example on how to configure the `translator`:

```ts
import { setTranslator } from '@42.nl/ui';

/**
 * Translation provider is given a key and data and is expected
 * to return a translated string.
 */
setTranslator(({ key, data }) => {
  /*
    All translations are given a `key` which is a string, and
    data which is an object containing extra keys.

    The data object will often contain things like the label for
    an error message, or an amount of things.
  */

  return // translated string here...
};

```

Here is a JSON notation containing all keys and default translations:

```json
{
  "AsyncContent": {
    "LOADING": {
      "TITLE": "Loading..."
    },
    "ERROR": {
      "TITLE": "Oops something went wrong!",
      "RETRY": "Retry"
    },
    "EMPTY": {
      "TITLE": "No results found",
    }
  },
  "ConfirmButton": {
    "MODAL_HEADER": "Confirmation",
    "CANCEL": "Cancel",
    "CONFIRM": "Confirm"
  },
  "MoreOrLess": {
    "LESS": "Show less",
    "MORE": "Show {{amount}} more"
  },
  "DateRangePicker": {
    "DATE_RANGE_ERROR": "The {{from}} must be before the {{to}}"
  },
  "ImageUpload": {
    "CHANGE": "Change",
    "REMOVE": "Remove",
    "CANCEL": "Cancel",
    "DONE": "Done",
    "REQUIRED": "{{label}} is required",
    "SIZE_TOO_LARGE": "{{label}} image is to large. Max size is {{maxSizeDisplay}} MB image size is {{fileSize}} MB"
  },
  "EmptyModal": {
    "NO_RESULTS": {
      "TITLE": "No results",
      "SUBTITLE": "No results were found please try again with a different query."
    },
    "EMPTY": {
      "TITLE": "No results",
      "SUBTITLE": "There is nothing here yet, the collection is empty."
    }
  },
  "ModalPicker": {
    "SEARCH": "Search...",
    "CANCEL": "Cancel",
    "SELECT": "Select"
  },
  "Select": {
    "LOADING": "Loading..."
  },
  "FileInput": {
    "REQUIRED": "{{label}} is required",
    "SIZE_TOO_LARGE": "{{label}} file is to large. Max size is {{maxSizeDisplay}} MB file size is {{fileSize}} MB"
  },
  "JarbFinalForm": {
    "VALIDATION": {
      "REQUIRED": "{{label}} is required",
      "MINIMUM_LENGTH": "{{label}} must be bigger than {{validationError.reasons.minimumLength}} characters",
      "MAXIMUM_LENGTH": "{{label}} must be smaller than {{reasons.maximumLength}} characters",
      "MIN_VALUE": "{{label}} must be more than {{reasons.minValue}}",
      "MAX_VALUE": "{{label}} must be less than {{reasons.maxValue}}",
      "NUMBER": "{{label}} is not a number",
      "NUMBER_FRACTION": "{{label}} is not a number. Number may have {{reasons.fractionLength}} digits behind the comma"
    }
  },
  "FormError": {
    "UNKNOWN_ERROR": "Something is wrong"
  },
  "Pager": {
    "NEXT": "Next",
    "PREVIOUS": "Previous"
  },
  "EpicTable": {
    "EpicDetail": {
      "CLOSE": "Close"
    }
  },
  "IconPicker": {
    "CLEAR": "Clear",
    "NO_RESULTS": {
      "TITLE": "No icons found",
      "SUBTITLE": "No icons were found, please try again with a different query."
    }
  },
  "ColorPicker": {
    "CLEAR": "Clear",
    "CANCEL": "Cancel",
    "SELECT": "Select"
  },
  "Loading": {
    "LOADING": "Loading...",
  },
  "RadioGroup": {
    "LOADING": "Loading..."
  },
  "OpenCloseModal": {
    "CANCEL": "Cancel",
    "SAVE": "Save"
  }
}
```

The JSON is nested to make it more readable. But a key you might
be given is `Pager.NEXT` or `JarbFinalForm.VALIDATION.REQUIRED`.
