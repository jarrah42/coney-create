import { Control } from 'rete';
import Vue from 'vue';;

const VueTextAreaControl = Vue.component('txt-area', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<textarea class="txtarea-control customTextarea" 
  :value="text"
  :readonly="readonly" 
  v-on:keyup="resize($event)" 
  @input="change($event)" 
  @dblclick.stop="" 
  @pointermove.stop=""></textarea>`,
  data() {
    return {
      text: ''
    }
  },
  methods: {
    change(e) {
      this.text = e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.text);
      }
      this.emitter.trigger('process');

      if(this.emitter.selected.list.length == 0){
        return;
      }
      var n = this.emitter.selected.list[0];
      return new Promise(resolve => {
        setTimeout(() => {
          this.emitter.view.updateConnections({ node: n });
        }, 10);
      });
    },
    resize(event){
      event.srcElement.style.height = "1px";
      event.srcElement.style.height = (10+event.srcElement.scrollHeight)+"px";
    }
  },
  mounted() {
    this.text = this.getData(this.ikey);
  }
})

export class TextAreaControl extends Control {
  component: any;
  props: any;
  vueContext: any;
  remChar = "asd";

  constructor(public emitter, public key, readonly = false) {
    super(key);
    
    readonly = emitter.plugins.get('readonly').enabled;

    this.component = VueTextAreaControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
