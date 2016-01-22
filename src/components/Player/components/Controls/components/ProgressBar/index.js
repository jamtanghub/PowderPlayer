﻿import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import ProgressStore from './store';
import ProgressActions from './actions';
import player from '../../../../utils/player';
import _ from 'lodash';

export
default React.createClass({

    mixins: [PureRenderMixin],

    getInitialState() {
        return {
            position: 0,
            scrobbling: false,
            keepScrobble: false,
            seekPerc: 0,
            scrobbleHeight: 'scrobbler'
        }
    },
    componentWillMount() {
        ProgressStore.listen(this.update);
    },
    componentDidMount() {
        window.addEventListener('mousemove', this.globalMouseMoved);
        window.addEventListener('mouseup', ProgressActions.handleGlobalMouseUp);
        player.events.on('resetPosition', this.resetPosition);
    },
    componentWillUnmount() {
        ProgressStore.unlisten(this.update);
        window.removeEventListener('mousemove', this.globalMouseMoved);
        window.removeEventListener('mouseup', ProgressActions.handleGlobalMouseUp);
        player.events.removeListener('resetPosition', this.resetPosition);
    },
    globalMouseMoved(evt) {
        ProgressActions.handleGlobalMouseMove(evt.pageX);
    },
    resetPosition() {
        ProgressActions.position(0);
    },
    throttleScrobblerHover(evt) {
        ProgressActions.handleScrobblerHover(evt.pageX);
    },
    update() {
        if (this.isMounted()) {
            console.log('progressbar update');
            var progressState = ProgressStore.getState();
            this.setState({
                position: progressState.position,
                scrobbling: progressState.scrobbling,
                progressHover: progressState.progressHover,
                scrobbleHeight: progressState.scrobbleHeight,

                keepScrobble: progressState.keepScrobble,
                seekPerc: progressState.seekPerc
            });
        }
    },
    render() {
        var scrobblerStyles = {
            time: {
                width: (this.state.scrobbling || this.state.keepScrobble ? this.state.seekPerc : this.state.position) * 100 + '%'
            }
        };
        return (
            <div>
                <div
                    className="scrobbler-padding"
                    onMouseUp={ProgressActions.handleScrobble}
                    onMouseDown={ProgressActions.handleDragStart}
                    onMouseEnter={ProgressActions.handleDragEnter}
                    onMouseOut={ProgressActions.handleDragEnd}
                    onMouseMove={this.throttleScrobblerHover} />
                <div ref="scrobbler-height" className={this.state.scrobbleHeight}>
                    <div className="buffer"/>
                    <div ref="scrobbler-time" style={scrobblerStyles.time} className="time"/>
                    <div ref="scrobbler-handle" className="handle"/>
                </div>
            </div>
        );
    }
});