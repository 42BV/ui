import 'react-quill/dist/quill.snow.css';
import '../src/main.scss';
import {setConstraints} from "@42.nl/jarb-final-form/lib";

import "./show-code-fix.scss";

setConstraints({
  Person: {
    firstName: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'firstName'
    },
    lastName: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'lastName'
    },
    age: {
      javaType: 'java.lang.Integer',
      types: ['number'],
      required: true,
      minimumLength: null,
      maximumLength: null,
      fractionLength: 0,
      radix: null,
      pattern: null,
      min: 16,
      max: 99,
      name: 'age'
    },
    eyeColor: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'eyeColor'
    },
    height: {
      javaType: 'java.lang.Integer',
      types: ['number'],
      required: true,
      minimumLength: null,
      maximumLength: null,
      fractionLength: 0,
      radix: null,
      pattern: null,
      min: 0,
      max: 220,
      name: 'height'
    },
    weight: {
      javaType: 'java.lang.Long',
      types: ['number'],
      required: true,
      minimumLength: null,
      maximumLength: null,
      fractionLength: 2,
      radix: null,
      pattern: null,
      min: 0,
      max: 220,
      name: 'weight'
    },
    jobTitle: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 29,
      fractionLength: 6,
      radix: 10,
      pattern: null,
      min: null,
      max: null,
      name: 'jobTitle'
    },
    favoriteFood: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'favoriteFood'
    },
    favoriteMovie: {
      javaType: 'java.lang.String',
      types: ['text'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'favoriteMovie'
    },
    birthDate: {
      javaType: 'java.time.Instant',
      types: ['date'],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'birthDate'
    },
    sex: {
      javaType: 'java.lang.String',
      types: [],
      required: true,
      minimumLength: null,
      maximumLength: 50,
      fractionLength: null,
      radix: null,
      pattern: null,
      min: null,
      max: null,
      name: 'sex'
    }
  }
});
