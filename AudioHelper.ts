import type {BuyResult} from "../../viewmodels/GameViewModel";

export class AudioHelper {

    private static readonly is_pitch_supported: boolean = true;
    private static readonly audio_slot_count: number = 50;

    private readonly cached_audio_dictionary: Record<string, HTMLAudioElement> = {};
    private readonly audio_slots: HTMLAudioElement[] = [];
    private audio_index: number = 0;

    constructor() {
        this.audio_slots = Array.from({length: AudioHelper.audio_slot_count}, (v, k) => new Audio());
        console.log("🔊 Successfully initialized audio engine");
    }

    /**
     * Plays a sound with the specified parameters
     */
    public play_sound(identifier: string, pitch_variance: number = 0, volume: number = 1) {
        let url = `snd/${identifier}.mp3`;

        if (!this.cached_audio_dictionary[url]) {
            this.cached_audio_dictionary[url] = new Audio(url);
            this.cached_audio_dictionary[url].onloadeddata = () => {
                this.play_sound(identifier, pitch_variance, volume);
            }
        } else if (this.cached_audio_dictionary[url].readyState >= 2) {
            const sound = this.audio_slots[this.audio_index];
            this.audio_index++;
            if (this.audio_index >= AudioHelper.audio_slot_count) this.audio_index = 0;
            sound.src = this.cached_audio_dictionary[url].src;
            sound.volume = Math.pow(volume, 2);
            if (AudioHelper.is_pitch_supported) {
                const rate = 1 + (Math.random() * 2 - 1) * pitch_variance;
                sound.preservesPitch = false;
                sound.playbackRate = rate;
            }
            sound.play();
        }
    }
}

export class AudioTypes {

    public readonly gui_back: string = "gui-back";
    public readonly gui_button_mini: string = "gui-button-mini";
    public readonly gui_checkbox_click: string = "gui-checkbox-click";
    public readonly gui_click: string = "gui-click";
    public readonly gui_close: string = "gui-close";
    public readonly gui_confirm: string = "gui-confirm";
    public readonly gui_square_button: string = "gui-square-button";
    public readonly gui_square_button_large: string = "gui-square-button-large";
    public readonly gui_error: string = "gui-error";
    public readonly power_up: string = "power-up";
    public readonly research_completed: string = "research-completed";
    public readonly achievement_unlocked: string = "achievement-unlocked";
    public readonly electricity_connect: string = "electricity-connect";
    public readonly electricity_disconnect: string = "electricity-disconnect";
    public readonly electricity_trip: string = "electricity-trip";
    public readonly electricity_restore: string = "electricity-restore";
    public readonly constructor_start: string = "constructor-start";
    public readonly constructor_stop: string = "constructor-stop";
    public readonly steam_release: string = "steam-release";
    public readonly crafting_finished: string = "crafting-finished";
    public readonly impact: string = "impact";

    public play_standard_buy_sound(result: BuyResult) {
        if (result.is_successfull) {
            AudioHelperInstance.play_sound(AudioTypesInstance.impact, 0.25);
        } else {
            if (!result.is_electricity_sufficient) {
                AudioHelperInstance.play_sound(AudioTypesInstance.electricity_disconnect, 0);
            } else {
                AudioHelperInstance.play_sound(AudioTypesInstance.gui_error, 0);
            }
        }

    }
}

export let AudioHelperInstance = new AudioHelper();
export let AudioTypesInstance = new AudioTypes();