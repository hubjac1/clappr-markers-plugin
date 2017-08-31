import { $ } from 'clappr'
import BaseMarker from './base-marker'

/*
 * An implementation of an image Marker, which can show an image.
 */
export default class CropMarker extends BaseMarker {

  /*
   * time: the time in seconds that this marker represents
   * tooltipImage: the image to be shown (optional)
   * width: width for the image (Default: 200px)
   * height: height for the image (Default: auto)
   */
	constructor (time, duration) {
		super(time)
		this._duration = duration || 5
	}

  /*
   * Returns the duration (in seconds) that this marker represents.
   */
	getDuration () {
        var duration = this._updateDurationValueFromCss();
		return duration
	}

    _updateDurationValueFromCss() {
        var duration = (this.videoDuration / 100) * parseFloat(this.getMarkerEl().style.width)
        if (isNaN(duration)) {
            duration = this._duration;
        } else {
            this._duration = duration;
        }
        return duration;
    }

    /*
   * Set the duration (in seconds) that this marker should represents.
   */
	setDuration (duration) {

		// TODO manager 0
		if(this._duration !== duration) {
            this._renderDuration(duration);
            this._duration = duration;
        }
	}

    _renderDuration(duration) {
        var percentage = Math.min(Math.max((this._time / this.videoDuration) * 100, 0), 100)
        let percentageWidth = Math.min(Math.max((duration / this.videoDuration) * 100, 0), 100 - percentage)

        this.getMarkerEl().style.width = percentageWidth + "%"
        //console.log("Width:" + percentageWidth + "%")
    }

    _renderTime(time) {
        let percentage = Math.min(Math.max((time / this.videoDuration) * 100, 0), 100)

        this.getMarkerEl().style.left = percentage + "%"
        //console.log("Left:" + percentage + "%")
    }

    render(){
		//console.log('render')
		this._renderDuration(this._duration)
		this._renderTime(this._time)
	}

    /*
	 * Should return the time (in seconds) that this marker represents.
	 */
    getTime () {
        var time = this._updateTimeFromCss();
        return time
    }

    _updateTimeFromCss() {
        var time = (this.videoDuration / 100) * parseFloat(this.getMarkerEl().style.left)
        if (isNaN(time)) {
            time = this._time;
        } else {
            this._time = time;
        }
        return time;
    }

    /*
	 * Set the time (in seconds) that this marker represents.
	 */
    setTime (time) {
    	if (this._time !== time) {
            this._renderTime(time);
            this._time = time;
        }
    }

    _buildMarkerEl () {
        if (typeof(jQuery) !== 'undefined') {
            var $marker = $('<div />').addClass('crop-marker')

            $marker.append($('<div id="wgrip"/>').addClass('crop-marker-handle').addClass('ui-resizable-handle').addClass('ui-resizable-w').addClass('left'))
            $marker.append($('<div id="egrip"/>').addClass('crop-marker-handle').addClass('ui-resizable-handle').addClass('ui-resizable-e').addClass('right'))

            jQuery($marker[0]).resizable({
                handles: {
                    'w': '#wgrip',
                    'e': '#egrip'
                },
                resize: (event, ui) => {
                    ui.originalElement.css({
                        'left': ('' + ((1.0 * ui.position.left / ui.originalElement.parents('.bar-container').width()) * 100.0)) + '%',
                        'width': ('' + ((1.0 * ui.size.width / ui.originalElement.parents('.bar-container').width()) * 100.0)) + '%'
                    })
                    this._updateDurationValueFromCss();
                    this._updateTimeFromCss();

                },
                maxHeight: 20,
                minHeight: 20
            });

            return $marker[0]
        }
	}

}
