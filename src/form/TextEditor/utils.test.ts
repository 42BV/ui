import { formatsFromToolbarModule } from './utils';

describe('formatsFromToolbarModule', () => {
  it('should when the "modules" are undefined return the default formats', () => {
    expect(formatsFromToolbarModule(undefined)).toEqual([
      'header',
      'list',
      'bold',
      'italic',
      'underline',
      'link'
    ]);
  });

  it('should when the "toolbar" is undefined return the default formats', () => {
    expect(formatsFromToolbarModule({ haha: 42 })).toEqual([
      'header',
      'list',
      'bold',
      'italic',
      'underline',
      'link'
    ]);
  });

  it('should when the "toolbar" has a "container" property use that instead of the "toolbar" prop', () => {
    const placeholders = [ { label: 'First name', value: 'firstName' } ];

    const modules = {
      toolbar: {
        container: [
          [
            {
              placeholder: placeholders.map(ph => ph.value)
            }
          ],
          [ 'bold', 'italic', 'underline', 'link' ]
        ],
        handlers: {
          placeholder: () => undefined
        }
      }
    };

    expect(formatsFromToolbarModule(modules)).toEqual([
      'placeholder',
      'bold',
      'italic',
      'underline',
      'link'
    ]);
  });

  it('should throw an error when "toolbar" is not an array', () => {
    expect(() => {
      formatsFromToolbarModule({ toolbar: 42 });
    }).toThrowError('TextEditor: expecting modules.toolbar to be an array');
  });

  it('should know how to extract formats from a complex toolbar definition ', () => {
    const modules = {
      toolbar: [
        [ 'bold', 'italic', 'underline', 'strike' ], // toggled buttons
        [ 'blockquote', 'code-block' ],

        [ { header: 1 }, { header: 2 } ], // custom button values
        [ { list: 'ordered' }, { list: 'bullet' } ],
        [ { script: 'sub' }, { script: 'super' } ], // superscript/subscript
        [ { indent: '-1' }, { indent: '+1' } ], // outdent/indent
        [ { direction: 'rtl' } ], // text direction

        [ { size: [ 'small', false, 'large', 'huge' ] } ], // custom dropdown
        [ { header: [ 1, 2, 3, 4, 5, 6, false ] } ],

        [ { color: [] }, { background: [] } ], // dropdown with defaults from theme
        [ { font: [] } ],
        [ { align: [] } ],

        [ 'link', 'image', 'video' ],

        [ 'clean' ]
      ]
    };

    expect(formatsFromToolbarModule(modules)).toEqual([
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code-block',
      'header',
      'list',
      'script',
      'indent',
      'direction',
      'size',
      'color',
      'background',
      'font',
      'align',
      'link',
      'image',
      'video',
      'clean'
    ]);
  });
});
