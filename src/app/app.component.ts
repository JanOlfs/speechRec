import { ChangeDetectorRef, Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'speechRec';
  recording = false;
  text = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermissions()
  }

  async startListening() {
    this.recording = true;
    const { available } = await SpeechRecognition.available();
    if(available) {
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'de-DE'
      });
      SpeechRecognition.addListener('partialResults', (data: any) => {
        console.log("partialResults was fired", data.matches);
        if(data.matches && data.matches.length > 0) {
          this.text = data.matches[0];
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  async stopListening() {
    this.recording = false;
    await SpeechRecognition.stop()
  }

}
