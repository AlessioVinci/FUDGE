namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * Display the project structure and offer functions for creation, deletion and adjustment of resources
   * @authors Jirka Dell'Oro-Friedl, HFU, 2020
   */
  export class PanelProject extends Panel {

    constructor(_container: ComponentContainer, _state: JsonValue | undefined) {
      super(_container, _state);

      //old registercomponent
      // this.goldenLayout.registerComponent(VIEW.INTERNAL, ViewInternal);
      // this.goldenLayout.registerComponent(VIEW.EXTERNAL, ViewExternal);
      // this.goldenLayout.registerComponent(VIEW.PROPERTIES, ViewProperties);
      // this.goldenLayout.registerComponent(VIEW.PREVIEW, ViewPreview);
      // this.goldenLayout.registerComponent(VIEW.SCRIPT, ViewScript);

      this.goldenLayout.registerComponentConstructor(VIEW.INTERNAL, ViewInternal);
      this.goldenLayout.registerComponentConstructor(VIEW.EXTERNAL, ViewExternal);
      this.goldenLayout.registerComponentConstructor(VIEW.PROPERTIES, ViewProperties);
      this.goldenLayout.registerComponentConstructor(VIEW.PREVIEW, ViewPreview);
      this.goldenLayout.registerComponentConstructor(VIEW.SCRIPT, ViewScript);

      let inner: ContentItem = this.goldenLayout.rootItem.contentItems[0];
      const config: RowOrColumnItemConfig = {
        type: "column",
        content: [{
          type: "row",
          content: [{
            type: "component",
            componentType: VIEW.PROPERTIES,
            componentState: _state,
            title: "Properties"
          }, {
            type: "component",
            componentType: VIEW.PREVIEW,
            componentState: _state,
            title: "Preview"
          }]
        }, {
          type: "row",
          content: [{
            type: "column",
            content: [{
              type: "component",
              componentType: VIEW.EXTERNAL,
              componentState: _state,
              title: "External"
            }, {
              type: "component",
              componentType: VIEW.SCRIPT,
              componentState: _state,
              title: "Script"
            }]
          }, {
            type: "component",
            componentType: VIEW.INTERNAL,
            componentState: _state,
            title: "Internal"
          }]
        }]
      };

      this.goldenLayout.rootItem.layoutManager.addItemAtLocation(config, [{ typeId: LayoutManager.LocationSelector.TypeId.Root }]);

      // this.dom.addEventListener(EVENT_EDITOR.SET_PROJECT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.SELECT, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.MUTATE, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
      // this.dom.addEventListener(EVENT_EDITOR.REFRES, this.hndEvent);

      this.setTitle("Project | " + project.name);
      this.broadcastEvent(new FudgeEvent(EVENT_EDITOR.SELECT, {}));
    }

    public getState(): { [key: string]: string } {
      // TODO: iterate over views and collect their states for reconstruction 
      return {};
    }

    private hndEvent = (_event: CustomEvent): void => {
      this.setTitle("Project | " + project.name);
      this.broadcastEvent(_event);
    }
  }
}