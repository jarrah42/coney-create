import { Control } from 'rete';
import Vue from 'vue';

const VueTextAreaLimitedControl = Vue.component('txt-area', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<textarea class="txtarea-control customTextarea" 
  :value="text"
  :readonly="readonly"
  v-on:keyup="resize($event)"
  @dblclick.stop="" 
  @pointermove.stop=""   
  @input="change($event)"   
  maxlength="200"></textarea>`,
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
    console.log("mounted")
    this.text = this.getData(this.ikey);
  }
})

export class TextAreaLimitedControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enabled;
    this.component = VueTextAreaLimitedControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
