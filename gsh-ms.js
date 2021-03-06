define(['require', 'github:janesconference/KievII@0.6.0/kievII'], function(require, K2) {
  
    var pluginConf = {
        name: "GSH MonoSynth",
        audioOut: 1,
        audioIn: 0,
        version: '0.0.1',
        hyaId: 'GSHMono',
        ui: {
            type: 'canvas',
            width: 574,
            height: 358
        },
        hostParameters : {
            enabled: false,
            parameters: {
                cutoff: {
                    name: ['Cutoff'],
                    label: 'Hz',
                    range: {
                        min: 0,
                        default: 0.2,
                        max: 1
                    }
                },
                resonance: {
                    name: ['Resonance'],
                    label: '',
                    range: {
                        min: 0,
                        default: 2,
                        max: 5
                    }
                },
                attack: {
                    name: ['Attack'],
                    label: 'samples',
                    range: {
                        min: 2,
                        default: 10000,
                        max: 22050
                    }
                },
                decay: {
                    name: ['Decay'],
                    label: 'samples',
                    range: {
                        min: 2,
                        default: 10000,
                        max: 22050
                    }
                },
                oscillator: {
                    name: ['Oscillator'],
                    label: 'type',
                    range: {
                        min: 0,
                        default: 2,
                        max: 4
                    }
                },
                filterMult: {
                    name: ['F Mul'],
                    label: 'x',
                    range: {
                        min: 0,
                        default: 0.3,
                        max: 1
                    }
                },
                octave2: {
                    name: ['Oct 2'],
                    label: '',
                    range: {
                        default: 2
                    }
                },
                octave3: {
                    name: ['Oct 3'],
                    label: '',
                    range: {
                        default: 0
                    }
                },
                glide: {
                    name: ['Glide'],
                    label: '',
                    range: {
                        min: 0,
                        default: 0,
                        max: 22050
                    }
                },
                amp: {
                    name: ['Amp'],
                    label: '',
                    range: {
                        min: 0,
                        default: 1,
                        max: 1
                    }
                },
                detune2: {
                    name: ['Detune 2'],
                    label: '',
                    range: {
                        min: -1,
                        default: 0.01,
                        max: 1
                    }
                },
                detune3: {
                    name: ['Detune 3'],
                    label: '',
                    range: {
                        min: -1,
                        default: -0.01,
                        max: 1
                    }
                }

            }
        }
    };
  
    var pluginFunction = function(args, resources, keyNotes) {
        
        this.audioDestination = args.audioDestinations[0];
        this.context = args.audioContext;

        this.gainNode = this.context.createGain();

        var gb_env = resources[0];
        this.Gibberish = gb_env.Gibberish;
        var knobImage = resources[1];
        var deckImage = resources[2];
        var oscButtonImages = Array.prototype.slice.call(resources, 3, 7);
        var octButtonImages = Array.prototype.slice.call(resources, 7, 10);

        this.Gibberish.init(this.context, this.gainNode);
        this.Gibberish.Time.export();
        this.Gibberish.Binops.export();

        this.oscType = ['Triangle', 'Saw', 'Square', 'Sine', 'Noise'];

        // Instantiate a monosynth with default parameters
        this.s = new this.Gibberish.MonoSynth({
          // TODO this is duplicate!
          attack: pluginConf.hostParameters.parameters.attack.range.default,
          resonance: pluginConf.hostParameters.parameters.resonance.range.default,
          cutoff: pluginConf.hostParameters.parameters.cutoff.range.default,
          decay: pluginConf.hostParameters.parameters.decay.range.default,
          waveform: this.oscType[ pluginConf.hostParameters.parameters.oscillator.range.default ],
          filterMult: pluginConf.hostParameters.parameters.filterMult.range.default,
          octave2: pluginConf.hostParameters.parameters.octave2.range.default - 1,
          octave3: pluginConf.hostParameters.parameters.octave3.range.default - 1,
          glide: pluginConf.hostParameters.parameters.glide.range.default,
          amp: pluginConf.hostParameters.parameters.amp.range.default,
          detune2: pluginConf.hostParameters.parameters.detune2.range.default,
          detune3: pluginConf.hostParameters.parameters.detune3.range.default
        }).connect();

        /*var sequencer = new gb_env.Gibberish.Sequencer({
          target: this.s, key:'note',
          values: [ Gibberish.Rndf(150, 300) ],
          durations:[ 22050 ]
        }).start(); */

        this.gainNode.connect(this.audioDestination);

        /* Parameter callbacks */
        var onParmChange = function (id, value) {
            this.pluginState[id] = value;
            if (id === 'cutoff') {
                this.s.cutoff = value;
            }
            if (id === 'resonance') {
                this.s.resonance = value;
            }
            if (id === 'attack') {
                var atk = Math.round(value);
                if (this.s.waveform !== atk) {
                    this.s.attack = atk;
                }
            }
            if (id === 'decay') {
                var dcy = Math.round(value);
                if (this.s.waveform !== dcy) {
                    this.s.decay = dcy;
                }
            }
            if (id === 'glide') {
                var glide = Math.round(value);
                if (this.s.waveform !== glide) {
                    this.s.glide = glide;
                }
            }
            if (id === 'amp') {
                this.s.amp = value;
            }
            if (id === 'oscillator') {
                var osc = this.oscType [value];
                if (this.s.waveform !== osc) {
                    this.s.waveform = osc;
                }
            }
            if (id === 'filterMult') {
                this.s.filterMult = value;
            }
            if (id === 'detune2') {
                this.s.detune2 = value;
            }
            if (id === 'detune3') {
                this.s.detune3 = value;
            }
            if (id === 'octave2') {
                var oct2 = value;
                if (this.s.octave2 !== oct2) {
                    this.s.octave2 = oct2;
                }
            }
            if (id === 'octave3') {
                var oct3 = value;
                if (this.s.octave3 !== oct3) {
                    this.s.octave3 = oct3;
                }
            }
        };

        if (args.initialState && args.initialState.data) {
            /* Load data */
            this.pluginState = args.initialState.data;
        }
        else {
            /* Use default data */
            this.pluginState = {
                decay: pluginConf.hostParameters.parameters.decay.range.default,
                attack: pluginConf.hostParameters.parameters.attack.range.default,
                resonance: pluginConf.hostParameters.parameters.resonance.range.default,
                cutoff: pluginConf.hostParameters.parameters.cutoff.range.default,
                oscillator: pluginConf.hostParameters.parameters.oscillator.range.default,
                filterMult: pluginConf.hostParameters.parameters.filterMult.range.default,
                octave2: pluginConf.hostParameters.parameters.octave2.range.default,
                octave3: pluginConf.hostParameters.parameters.octave3.range.default,
                glide: pluginConf.hostParameters.parameters.glide.range.default,
                amp: pluginConf.hostParameters.parameters.amp.range.default,
                detune2: pluginConf.hostParameters.parameters.detune2.range.default,
                detune3: pluginConf.hostParameters.parameters.detune3.range.default
            };
        }

        // INTERFACE STUFF

        /* INTERFACE INIT */
        this.ui = new K2.UI ({type: 'CANVAS2D', target: args.canvas}, {'breakOnFirstEvent': true});

        /* BACKGROUND INIT */
        var bgArgs = new K2.Background({
            ID: 'background',
            image: deckImage,
            top: 0,
            left: 0
        });

        this.ui.addElement(bgArgs, {zIndex: 0});

        /* KEYS INIT */
        var keyCB = function (slot,value, element) {
            var note, octave;

            var note_hash = {"C4": 261.626, "C#4": 277.183, "D4": 293.665, "D#4": 311.127, "E4": 329.628, "F4": 349.228, "F#4": 369.994, "G4": 391.995, "G#4": 415.305, "A4": 440, "A#4": 466.164, "B4": 493.883};

            if (value === 1) {
                var note_arr = element.split ("_");
                note = note_arr[0];

                octave = 4;

                if (note_arr[1] === 'd') {
                    note += '#';
                }
                note += octave;
                this.s.note(note_hash[note]);
            }

            this.ui.refresh();
        }.bind(this);

        var key = {
            ID: "",
            left: 0,
            top: 257,
            mode: 'immediate',
            imagesArray : null,
            onValueSet: keyCB
        };

        for (var i = 0; i < keyNotes.length; i+=1) {
            key.ID = keyNotes[i];
            key.left = 15 + (i * 45);
            key.imagesArray = [resources[10 + i * 2], resources[11 + i * 2]];
            this.ui.addElement(new K2.Button(key), {zIndex: 1});
        }

        /* KNOB INIT */
        // TODO these are duplicates
        this.knobDescription = [
            {id: 'attack', init: this.pluginState.attack, x: 20, y: 20},
            {id: 'decay', init: this.pluginState.decay, x: 104, y: 20},
            {id: 'cutoff', init: this.pluginState.cutoff, x: 194, y: 20},
            {id: 'resonance', init: this.pluginState.resonance, x: 278, y: 20},
            {id: 'filterMult', init: this.pluginState.filterMult, x: 194, y: 134},
            {id: 'glide', init: this.pluginState.glide, x: 20, y: 134},
            {id: 'amp', init: this.pluginState.amp, x: 104, y: 134},
            {id: 'detune2', init: this.pluginState.detune2, x: 384, y: 134},
            {id: 'detune3', init: this.pluginState.detune3, x: 484, y: 134}
        ];

        var MIDI2Freq = function (n) {
            var freq = 440 * Math.pow(2, ((n - 69) / 12));
            return freq;
        };

        var knobArgs = {
            ID: '',
            left: 0 ,
            top: 0,
            imagesArray : [knobImage],
            sensitivity : 5000,
            tileWidth: 64,
            tileHeight: 64,
            imageNum: 64,
            bottomAngularOffset: 33,
            onValueSet: function (slot, value, element) {
                this.pluginState[element] = value;
                var scaledValue = K2.MathUtils.linearRange (0, 1, pluginConf.hostParameters.parameters[element].range.min, pluginConf.hostParameters.parameters[element].range.max, value);
                onParmChange.call (this, element, scaledValue);
                this.ui.refresh();
            }.bind(this),
            isListening: true
        };

        for (var i = 0; i < this.knobDescription.length; i+=1) {
            var currKnob = this.knobDescription[i];
            knobArgs.ID = currKnob.id;
            knobArgs.top = currKnob.y;
            knobArgs.left = currKnob.x;
            this.ui.addElement(new K2.Knob(knobArgs));
            var initValue = currKnob.init;
            var rangedInitValue = K2.MathUtils.linearRange (pluginConf.hostParameters.parameters[currKnob.id].range.min, pluginConf.hostParameters.parameters[currKnob.id].range.max, 0, 1, initValue);
            this.ui.setValue ({elementID: knobArgs.ID, value: rangedInitValue, fireCallback:false});
        }

        /* OCTAVE BUTTONS INIT */
        // Oscillator
        var oscButton = {
            ID: "oscillator",
            left: 293,
            top: 142,
            imagesArray : oscButtonImages,
            onValueSet: function (slot, value, element) {
                onParmChange.call (this, element, value);
                this.ui.refresh();
            }.bind(this)
        };
        
        this.ui.addElement(new K2.Button(oscButton), {zIndex: 1});
        this.ui.setValue ({elementID: oscButton.ID, value: this.pluginState.oscillator, fireCallback:false});

        // Oscillator2 Octave
        var oct2Button = {
            ID: "octave2",
            left: 371,
            top: 45,
            imagesArray : octButtonImages,
            onValueSet: function (slot, value, element) {
                onParmChange.call (this, element, value - 1);
                this.ui.refresh();
            }.bind(this)
        };
        
        this.ui.addElement(new K2.Button(oct2Button), {zIndex: 1});
        this.ui.setValue ({elementID: oct2Button.ID, value: this.pluginState.octave2, fireCallback:false});

        // Oscillator3 Octave
        var oct3Button = {
            ID: "octave3",
            left: 480,
            top: 45,
            imagesArray : octButtonImages,
            onValueSet: function (slot, value, element) {
                onParmChange.call (this, element, value - 1);
                this.ui.refresh();
            }.bind(this)
        };
        
        this.ui.addElement(new K2.Button(oct3Button), {zIndex: 1});
        this.ui.setValue ({elementID: oct3Button.ID, value: this.pluginState.octave3, fireCallback:false});
        
        this.ui.refresh();

        var saveState = function () {
            return { data: this.pluginState };
        };

        args.hostInterface.setSaveState (saveState.bind (this));

        var onMIDIMessage = function (message, when) {
            if (when) {
                return;
            }
            if (message.type === 'noteon') {
                var freq = MIDI2Freq (message.pitch);
                var vel = message.velocity / 127;
                this.s.note(freq, vel);
            }
            /*if (message.type === 'noteoff') {
                var freq = MIDI2Freq (message.pitch);
                var vel = 0;
                this.s.note(freq, vel);
            }*/
        };

        args.MIDIHandler.setMIDICallback (onMIDIMessage.bind (this));


        // Initialization made it so far: plugin is ready.
        args.hostInterface.setInstanceStatus ('ready');
    };
    
    
    var initPlugin = function(initArgs) {
        var args = initArgs;

        var requireErr = function (err) {
            args.hostInterface.setInstanceStatus ('fatal', {description: 'Error initializing plugin.'});
        }.bind(this);

        var keyNotes = ["C_f", "C_d", "D_f", "D_d", "E_f", "F_f", "F_d", "G_f", "G_d", "A_f", "A_d", "B_f"];
        var resList = [ 'github:janesconference/Gibberish/gibberish',
                        './assets/images/knob_64_64_64.png!image',
                        './assets/images/deck.png!image',
                        './assets/images/MoogSwitchVRed0.png!image',
                        './assets/images/MoogSwitchVRed1.png!image',
                        './assets/images/MoogSwitchVRed2.png!image',
                        './assets/images/MoogSwitchVRed3.png!image',
                        './assets/images/MoogSwitchHRed0.png!image',
                        './assets/images/MoogSwitchHRed1.png!image',
                        './assets/images/MoogSwitchHRed2.png!image'
                        ];

        var keyNotes_images = [];
        for (var i = 0; i < keyNotes.length; i+=1) {
            keyNotes_images.push('./assets/images/' + keyNotes[i] + '_i.png!image');
            keyNotes_images.push('./assets/images/' + keyNotes[i] + '_a.png!image');
        }
        resList = resList.concat(keyNotes_images);

            require (resList,
                function () {
                    pluginFunction.call (this, args, arguments, keyNotes);
                }.bind(this),
                function (err) {
                    console.error ("require error");
                    requireErr (err);
                }
            );
    
    };
        
    return {
        initPlugin: initPlugin,
        pluginConf: pluginConf
    };
});
