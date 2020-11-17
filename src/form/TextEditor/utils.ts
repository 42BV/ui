import { StringMap } from 'quill';
import { isArray, flatMap, uniq } from 'lodash';

/* 
  When module.toolbar exists it will generate the formats for Quill
  based on the items in the toolbar.

  When module or toolbar is empty the default formats are returned.
*/
export function formatsFromToolbarModule(
  modules: StringMap | undefined
): string[] {
  // If there are no modules use the default formats
  if (!modules) {
    return defaultFormats();
  }

  let { toolbar } = modules;

  // If there is no toolbar defined use the default formats
  if (!toolbar) {
    return defaultFormats();
  }

  // When advanced toolbars are used we want to take the container.
  if (toolbar.container) {
    toolbar = toolbar.container;
  }

  if (!isArray(toolbar)) {
    throw new Error('TextEditor: expecting modules.toolbar to be an array');
  }

  return uniq(formatsForToolbar(toolbar));
}

/* 
  Recursive function which can generate the formats based 
  on the toolbar
*/
function formatsForToolbar(toolbarItem: any): string | string[] {
  if (typeof toolbarItem === 'string') {
    // toolbar strings are also the formats, so we can just return
    // them as is.
    return toolbarItem;
  } else if (isArray(toolbarItem)) {
    // Further reduce the array of formats, it could be an array of
    // strings or objects or mixed at this point.
    return flatMap(toolbarItem, formatsForToolbar);
  } else {
    // When an object the keys of the objects are the formats
    return formatsForToolbar(Object.keys(toolbarItem));
  }
}

/* 
  Helper to create the default formats. These are the formats of
  the default toolbar of the TextEditor component.
  
  Is a function to prevent accidental mutations.
*/
function defaultFormats() {
  return ['header', 'list', 'bold', 'italic', 'underline', 'link'];
}
