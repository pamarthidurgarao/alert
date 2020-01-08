import { Component, OnInit, OnDestroy } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

declare var SMSReceive: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  msg: string = '';
  toggle: boolean = false;
  matchData: any = [];
  messages = [];
  testData = "";
  data = [
    { 'name': 'Phone Pe', 'key': 'phonpe', 'type': 'wallet', 'checked': false },
    { 'name': 'Paytm', 'key': 'paytm', 'type': 'wallet', 'checked': false },
    { 'name': 'Gpay', 'key': 'googlepay', 'type': 'wallet', 'checked': false },
    { 'name': 'Amazon Pay', 'key': 'amazonpay', 'type': 'wallet', 'checked': false },
    { 'name': 'Axis Bank', 'key': 'axis', 'type': 'bank', 'checked': false },
    { 'name': 'SBI', 'key': 'sbi', 'type': 'bank', 'checked': false },
    { 'name': 'WAYSMS', 'key': 'waysms', 'type': 'bank', 'checked': false }
  ]

  constructor(private tts: TextToSpeech, private backgroundMode: BackgroundMode) { }

  ngOnInit() {
    this.backgroundMode.enable();
    if (localStorage.getItem('match')) {
      this.matchData = JSON.parse(localStorage.getItem('match'));
    } else {
      this.matchData = this.data;
      localStorage.setItem('match', JSON.stringify(this.data))
    }
    this.start();
  }

  ngOnDestroy() {
    localStorage.setItem('match', JSON.stringify(this.matchData));
  }

  start() {
    this.toggle = true;
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log(e);
          var IncomingSMS = e.data;
          this.processSMS(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  stop() {
    this.toggle = false;
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data) {
    console.log(data)
    const message = data.body;
    this.msg = data.body;
    const voice = this.prepareVoiceMessage(data);
    // this.messages.push(voice);

    // this.messages = this.messages.filter(ele => {
    //   ele.date != data.date
    // })
    setTimeout(() => {
      if (voice)
        this.tts.speak(voice).then(() => console.log('Success'))
          .catch((reason: any) => console.log(reason));
    }, 1000);
  }

  listenEvent() {
    debugger
    if (this.toggle) {
      this.stop();
    } else {
      this.start();
    }
  }

  prepareVoiceMessage(data) {
    let type;
    for (let ele = 0; ele < this.matchData.length; ele++) {
      if (data.address.toLowerCase().indexOf(this.matchData[ele].key) != -1 && this.matchData[ele].checked) {
        let amount = this.readAmount(data, 'credited');
        type = "credited";
        if (!amount) {
          amount = this.readAmount(data, 'debited');
          type = "debited";
        }
        if (amount) {
          let msg = "your" + this.matchData[ele].name + " " + this.matchData[ele].type + " account is" + type + " with " + amount + " rupees";
          return msg;
        }
      }
    }
  }

  readAmount(data, type) {
    const subMsg = data.body.substring(data.body.indexOf(type), data.body.length);
    var msgList = subMsg.split(' ');
    var nextEle = false;
    var amount;
    for (let i = 0; i < msgList.length; i++) {
      if (nextEle && !isNaN(msgList[i])) {
        amount = parseInt(msgList[i]);
        break;
      }
      let ind;
      if ((ind = msgList[i].toLowerCase().indexOf("rs")) != -1) {
        const num = msgList[i].substr(ind + 2, msgList[i].length);
        if (!isNaN(num)) {
          amount = parseInt(num);
          break;
        }
        nextEle = true;
      }
    }
    return amount;
  }

  selectChange() {
    localStorage.setItem('match', JSON.stringify(this.matchData))
  }

  observe() {
    Object.defineProperty(this.messages, "push", {
      enumerable: false, // hide from for...in
      configurable: false, // prevent further meddling...
      writable: false, // see above ^
      value: function () {
        for (var i = 0, n = this.length, l = arguments.length; i < l; i++ , n++) {
          // RaiseMyEvent(this, n, this[n] = arguments[i]); // assign/raise your event
        }
        return n;
      }
    });
  }

  addToList() {
    let data = { 'name': this.testData, 'key': this.testData, 'type': 'wallet', 'checked': false };
    this.matchData.push(data);
    this.testData = '';
  }
}
