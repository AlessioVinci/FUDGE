var Custom;
(function (Custom_1) {
    window.addEventListener("load", init);
    let templates = new Map();
    let CustomElement = /** @class */ (() => {
        class CustomElement extends HTMLElement {
            constructor(_key) {
                super();
                this.initialized = false;
                if (_key)
                    this.setAttribute("key", _key);
            }
            get key() {
                return this.getAttribute("key");
            }
            static get nextId() {
                return "ƒ" + CustomElement.idCounter++;
            }
        }
        CustomElement.idCounter = 0;
        return CustomElement;
    })();
    Custom_1.CustomElement = CustomElement;
    let CustomElementBoolean = /** @class */ (() => {
        class CustomElementBoolean extends CustomElement {
            constructor(_key, _label, _value = false) {
                super(_key);
                if (_label == undefined)
                    _label = _key;
                if (_label)
                    this.setAttribute("label", _label);
            }
            connectedCallback() {
                let input = document.createElement("input");
                input.type = "checkbox";
                input.id = CustomElement.nextId;
                this.appendChild(input);
                let label = document.createElement("label");
                label.textContent = this.getAttribute("label");
                label.htmlFor = input.id;
                this.appendChild(label);
                console.log(this.getAttribute("key"));
            }
        }
        // @ts-ignore
        CustomElementBoolean.customElement = customElements.define("fudge-boolean", CustomElementBoolean);
        return CustomElementBoolean;
    })();
    Custom_1.CustomElementBoolean = CustomElementBoolean;
    class Custom extends HTMLElement {
        constructor() {
            super();
            this.initialized = false;
        }
        connectedCallback() {
            if (this.initialized)
                return;
            let fragment = templates.get(Reflect.get(this.constructor, "tag"));
            let content = fragment.firstElementChild;
            let style = this.style;
            for (let entry of content.style) {
                style.setProperty(entry, Reflect.get(content.style, entry));
            }
            for (let child of content.childNodes) {
                this.appendChild(child.cloneNode(true));
            }
            this.initialized = true;
        }
    }
    Custom_1.Custom = Custom;
    // export function registerTemplate(_template: HTMLTemplateElement): void {
    function registerTemplate(_tagName) {
        for (let template of document.querySelectorAll("template")) {
            if (template.content.firstElementChild.localName == _tagName) {
                console.log("Register", template);
                templates.set(_tagName, template.content);
            }
        }
    }
    Custom_1.registerTemplate = registerTemplate;
    function registerClass(_tag, _class) {
        console.log(_tag, _class);
        _class.tag = _tag;
        customElements.define(_tag, _class);
    }
    Custom_1.registerClass = registerClass;
    let Stepper = /** @class */ (() => {
        class Stepper extends HTMLParagraphElement {
            constructor(_label = "Parameter") {
                super();
                this.initialized = false;
                console.log("I'm alive");
                this.label = document.createElement("label");
                this.label.innerHTML = _label;
                this.input = document.createElement("input");
                this.input.type = "number";
            }
            connectedCallback() {
                console.log("I'm adopted");
                if (this.initialized)
                    return;
                console.log("Initializing");
                console.log("Label", this.getAttribute("label"));
                console.log("Inner", this.textContent);
                this.appendChild(this.label);
                this.appendChild(this.input);
                this.initialized = true;
            }
            disconnectedCallback() {
                console.log("I'm abandoned");
            }
        }
        Stepper.customElement = customElements.define("test-stepper", Stepper, { extends: "p" });
        return Stepper;
    })();
    function init(_event) {
        // let stepper: Stepper = document.querySelector("[is=test-stepper]");
        // console.log(stepper);
        // console.log(stepper.innerHTML);
        // document.body.removeChild(stepper);
        // document.body.appendChild(stepper);
        // let stepper2: Stepper = new Stepper("Step2");
        // document.body.appendChild(stepper2);
        // let templates: NodeListOf<HTMLTemplateElement> = document.querySelectorAll("template");
        for (let entry of templates) {
            let name = entry[0];
            let fieldset = document.createElement("fieldset");
            let legend = document.createElement("legend");
            legend.textContent = name;
            fieldset.appendChild(legend);
            fieldset.appendChild(document.createElement(name));
            document.body.appendChild(fieldset);
        }
        let fudgeBoolean = new CustomElementBoolean("test", "testlabel", true);
        document.body.appendChild(fudgeBoolean);
        document.createElement("fudge-boolean");
        // customElements.define("custom-boolean", CustomElementBoolean);
        // customElements.define("custom-vector3", CustomVector3);
    }
})(Custom || (Custom = {}));
//# sourceMappingURL=Main.js.map