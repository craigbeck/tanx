
import {Socket} from "phoenix"
import "phoenix_html"

import ChatClient from "js/chat"
import Arena from "js/arena"
import ArenaAnimate from "js/arena/animate"
import ArenaSound from "js/arena/sound"
import Lobby from "js/lobby"
import PlayerList from "js/player_list"
import Settings from "js/settings"
import About from "js/about"


class TanxApp {

  constructor() {
    let socket = new Socket("/ws", {
      reconnectAfterMs: function(tries) {
        return [1, 100, 200, 400, 800][tries - 1] || 1000;
      }
    });
    socket.connect();

    let arenaSound = new ArenaSound();
    let arenaAnimate = new ArenaAnimate(arenaSound);

    this._lobby = new Lobby(socket);
    this._playerList = new PlayerList();
    this._chatClient = new ChatClient();
    this._about = new About();
    this._settings = new Settings(arenaSound);
    this._arena = new Arena(arenaAnimate);

    this._lobby.onJoin((gameId, gameChannel) => {
      this._playerList.start(gameChannel);
      this._chatClient.start(gameChannel);
      this._arena.start(gameId, gameChannel);
    });
    this._lobby.onLeave((gameId, gameChannel) => {
      this._playerList.stop();
      this._chatClient.stop();
      this._arena.stop();
    });
    this._lobby.onRejoin((gameId, gameChannel) => {
      this._playerList.restart(gameChannel);
      this._arena.restart(gameChannel);
    });

    arenaAnimate.onPlayerBooted((gameId, gameChannel) => {
      this._lobby.leave();
    });
  }

}

let app = new TanxApp();
window.tanxApp = app

export default app;
