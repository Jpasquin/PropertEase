# PropertEase ([Link](https://propertease-5ff7d.web.app))

### [Meeting Minutes](https://docs.google.com/document/d/1fAs3DRg0vzcju0SPYCO5jQVp3JQgr2mX9F3wEzdK4c8/edit?usp=sharing)
### [Sprint Planning]()
### [Contribution Log](https://docs.google.com/document/d/14Vl4Anu5Lk7ZvlzS5H4oGLovtiyfDHwU7j5zh7lyEos/edit?usp=sharing)
### [User Stories](https://docs.google.com/document/d/1C_qaazkOoA4voUydYpOeJQQqoFUSTETEa56SImrKguc/edit?usp=sharing)

## Description
A real estate web application designed to facilitate the buying, selling, and renting, of real estate properties. These applications offer a wide range of features and functionalities to streamline the entire real estate transaction process, making it more convenient and efficient for users. 

We identify four primary users: Homebuyers, Property renters,  system administrator(s), and (real-state) brokers. Homebuyers search for properties to buy.  They can request a visit to the broker managing the unit.  They have different criteria to search for properties, including filtering by price range; the number of rooms; living and lot area dimensions; time in the market; building type; year built, etc.  They can also search for brokers, or use a calculator to estimate the monthly payment of a property of their interest.  Property renters are individuals or families seeking rental accommodations.  They can use similar search criteria as homebuyers, and they can also request visits to a property.
The system administrator is responsible for adding/removing brokers.  The brokers manage their own property listings.  Brokers can also make purchase offers to properties listed by other brokers.

## Team & Roles

* Jonathan Pasquin - 
* Youssef Ouakaa - Front End Developer - Broker user functionality
* Noura Tabbara -
* Sarah Malik - Front End - Homebuyer/Renter Functionality
* Mark Ghaby -
* Andrei Mihaescu -

## Technology and Approach

### VueJS with Quasar and TypeScript
- **VueJS**: A progressive JavaScript framework for building user interfaces. It's simple, fast, and has a gentle learning curve.
  - Reactive data-binding makes it easy to manage state and build dynamic interfaces. It's also lightweight and optimized for performance.
- **Quasar**: A high-performance Material Design component suite with builders for SPA, SSR, PWA, Mobile (Cordova & Capacitor), Electron, and Browser Extensions.
  - Offers a rich set of components and directives, making it faster to develop cross-platform applications.
- **TypeScript**: A typed superset of JavaScript that adds optional types.
  - Brings static type-checking along with the latest ECMAScript features. This enhances code quality and understandability, making the development process smoother.

### Google Firebase
- **Authentication**: Provides an easy-to-use suite of authentication options ranging from email & password, social providers, and more.
  - Reduces the need for backend development for authentication and provides a secure, scalable solution.
- **Realtime Database**: A cloud-hosted NoSQL database. Data is stored as JSON and synchronized in real-time to every connected client.
  - Perfect for building real-time applications where you want to detect changes instantly.
- **Firestore**: A flexible, scalable database for mobile, web, and server development. It keeps your data in sync across client apps through real-time listeners.
  - Offers advanced querying and filtering of data. It's also more scalable than the Realtime Database.
- **Hosting**: Provides fast and secure hosting for your web app, static and dynamic content, and microservices.
  - Simplifies deployment process with one command, and serves your site over a secure connection.

### Tailwind
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom user interfaces.
  - Rather than hand-coding or overriding a rigid set of pre-defined styles, Tailwind allows developers to construct a unique design by composing utility classes in the HTML.

The combination of VueJS with Quasar and TypeScript offers a robust foundation for building dynamic and cross-platform applications. With Firebase, we get a serverless architecture that's perfect for swiftly developing scalable apps without the hassle of managing infrastructure. TailwindCSS complements this by providing a means to rapidly prototype and style our application without leaving the HTML. This stack is especially advantageous for projects where speed and efficiency are paramount, offering a lightweight yet powerful set of tools to turn ideas into reality swiftly.


## Instructions
### Clone the repository
```bash
git clone git@github.com:Jpasquin/spectrum-soen341projectF2023.git
```
### Install the dependencies
```bash
npm install
```
### Start the app in development mode
```bash
quasar dev
```

