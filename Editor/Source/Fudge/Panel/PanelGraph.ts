namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
  * Shows a graph and offers means for manipulation
  * @authors Monika Galkewitsch, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
  */
  export class PanelGraph extends Panel {
    private graph: ƒ.Graph;

    constructor(_container: ComponentContainer, _state: JsonValue | undefined) {
      super(_container, _state);

      this.goldenLayout.registerComponentConstructor(VIEW.RENDER, ViewRender);
      this.goldenLayout.registerComponentConstructor(VIEW.COMPONENTS, ViewComponents);
      this.goldenLayout.registerComponentConstructor(VIEW.HIERARCHY, ViewHierarchy);

      this.setTitle("Graph");

      const config: RowOrColumnItemConfig = {
        type: "column",
        content: [{
          type: "component",
          componentType: VIEW.RENDER,
          componentState: _state,
          title: "Render"
        }, {
          type: "row",
          content: [{
            type: "component",
            componentType: VIEW.HIERARCHY,
            componentState: _state,
            title: "Hierarchy"
          }, {
            type: "component",
            componentType: VIEW.COMPONENTS,
            componentState: _state,
            title: "Components"
          }]
        }]
      };


      this.goldenLayout.addItemAtLocation(config, [{ typeId: LayoutManager.LocationSelector.TypeId.Root }]);
      // this.goldenLayout.addItemAtLocation(hierarchyAndComponents, [{ typeId: LayoutManager.LocationSelector.TypeId.Root }]);


      this.dom.addEventListener(EVENT_EDITOR.SELECT, this.hndEvent);
      this.dom.addEventListener(EVENT_EDITOR.MODIFY, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.MUTATE, this.hndEvent);
      this.dom.addEventListener(ƒui.EVENT.SELECT, this.hndFocusNode);
      this.dom.addEventListener(ƒui.EVENT.RENAME, this.broadcastEvent);
      this.dom.addEventListener(EVENT_EDITOR.TRANSFORM, this.hndEvent);

      if (_state["graph"])
        ƒ.Project.getResource(_state["graph"]).then((_graph: ƒ.Graph) => {
          this.dispatch(EVENT_EDITOR.SELECT, { detail: { graph: _graph } });
          // TODO: trace the node saved. The name is not sufficient, path is necessary...
          // this.dom.dispatchEvent(new CustomEvent(EVENT_EDITOR.FOCUS_NODE, { detail: _graph.findChild }));
        });
    }

    public setGraph(_graph: ƒ.Graph): void {
      if (_graph) {
        this.setTitle("Graph | " + _graph.name);
        this.graph = _graph;
        return;
      }

      this.setTitle("Graph");
    }

    public getState(): { [key: string]: string } {
      let state: PanelState = {};
      if (this.graph) {
        state.graph = this.graph.idResource;
        return state;
      }
      // TODO: iterate over views and collect their states for reconstruction 
    }

    private hndEvent = async (_event: FudgeEvent): Promise<void> => {
      switch (_event.type) {
        case EVENT_EDITOR.SELECT:
          this.setGraph(_event.detail.graph);
        case EVENT_EDITOR.MODIFY:
          // TODO: meaningful difference between update and setgraph
          if (this.graph) {
            let newGraph: ƒ.Graph = <ƒ.Graph>await ƒ.Project.getResource(this.graph.idResource);
            if (this.graph != newGraph)
              _event = new FudgeEvent(EVENT_EDITOR.SELECT, { detail: { graph: newGraph } });
          }
          break;
      }

      this.broadcastEvent(_event);
      _event.stopPropagation();
    }

    private hndFocusNode = (_event: CustomEvent): void => {
      let event: FudgeEvent = new FudgeEvent(EVENT_EDITOR.FOCUS, { bubbles: false, detail: { node: _event.detail.data } });
      this.broadcastEvent(event);
    }
  }
}