
  
<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
	<h1 align="center">IP-Tool</h1>
</div>



<!-- TABLE OF CONTENTS -->
<details>
	<summary>Table of Contents</summary>
	<ol>
		<li>
			<a href="#about-the-project">About The Project</a>
			<ul>
				<li><a href="#built-with">Built With</a></li>
			</ul>
		</li>
		<li>
			<a href="#getting-started">Getting Started</a>
			<ul>
				<li><a href="#prerequisites">Prerequisites</a></li>
				<li><a href="#project-setup">Project Setup</a></li>
				<li><a href="#deployment">Deployment</a></li>
			</ul>
		</li>
		<li><a href="#usage">Usage</a></li>
	</ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A simple web application that adds IP addresses both IPv4 and IPv6 adding comments and labels for specific use cases and  allows tracking of changes within an IP.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  v22.19.0
<br>
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) v18
<br>
[![Material][Material]][Material-url]
<br>
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
<br>

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This guide explains how to set up a local copy of the project, which includes information on installation for prerequisites.

### Prerequisites

 _Install Node.js_

* To install Node.js go to the [![NodeJS][Node.JS]][Node-url] website and download the recommended Node.js LTS

_Install Angular CLI_ 
  
 * To install the Angular CLI, open a terminal window and run the following command:
	 * <sub>Angular applications depend on [npm packages](https://docs.npmjs.com/getting-started/what-is-npm) for many features and functions. This guide uses the [npm client](https://docs.npmjs.com/cli/install) command line interface, which is installed with `Node.js` by default. </sub>
 ```
  npm install -g @angular/cli
  ```

For Angular v18
```
npm install -g @angular/cli@18
```
Install MongoDB
* Download and Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
* (Optional) Download and Install [MongoDB Compass](https://www.mongodb.com/try/download/compass) GUI for MongoDB

### Project Setup

1. Clone the Github repository for the project

   ```
   git clone https://github.com/geolinsanity/IP-Tool.git
   ```

2. Install packages for both Frontend and Backend

	Frontend:
	```
	cd frontend
	npm install
	```

	Backend:
	```
	cd backend
	npm install
	```
3. Install NPM packages
   ```sh
   npm install
   ```

4. Create a .env at root of backend folder and add the details for you environment
   ```env
    DB_HOST = <DB_HOST>
    DB_PORT = <DB_PORT>
    DB_NAME = <DB_NAME>
    PORT = <PORT >
    SECRET_KEY = <SECRET_KEY>
   ```

5. Run both Frontend and Backend
   ```
   npm start
   ```


<p align="right">(<a href="#top">back to top</a>)</p>


### Deployment

 _TBD_

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

   Execute code lint check
   ```sh
   npm run lint
   ```
   
   Execute code lint check and fix
   ```sh
   npm run lint:fix
   ```

   Command to copy static and asset files
   ```sh
   npm run copy
   ```

   Start command for Manual Start
   ```sh
   npm run start
   ```

   Watch command for Auto Restart of application when changes are saved
   ```sh
   npm run watch
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

[Node.js]: https://img.shields.io/badge/Node-20232A?logo=node.js&style=for-the-badge
[Node-url]: https://nodejs.org/en/
[Angular]: https://img.shields.io/badge/Angular-20232A?style=for-the-badge&logo=angular&logoColor=B52E31
[Angular-url]: https://angular.io/
[Material]: https://img.shields.io/badge/Material-20232A?style=for-the-badge&logo=angular&logoColor=FFFFFF
[Material-url]: https://img.shields.io/badge/Material-20232A?style=for-the-badge&logo=angular&logoColor=FFFFFF
