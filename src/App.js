import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Square(props) {
  if (props.highlight) {
    return React.createElement(
      "button",
      { className: "square", onClick: function onClick() {
          return props.onClick();
        }, style: { color: "red" } },
      props.value
    );
  } else {
    return React.createElement(
      "button",
      { className: "square", onClick: function onClick() {
          return props.onClick();
        } },
      props.value
    );
  }
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Board.prototype.renderSquare = function renderSquare(i) {
    var _this2 = this;

    return React.createElement(Square, {
      key: i,
      value: this.props.squares[i],
      onClick: function onClick() {
        return _this2.props.onClick(i);
      },
      highlight: this.props.winnerLine.includes(i)
    });
  };

  Board.prototype.render = function render() {
    var wrapper = [];
    for (var i = 0; i < 3; i++) {
      var row = [];
      for (var j = 3 * i; j < 3 * (i + 1); j++) {
        row.push(this.renderSquare(j));
      }
      wrapper.push(React.createElement(
        "div",
        { className: "board-row", key: i },
        row
      ));
    }
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "status" },
        this.props.status
      ),
      wrapper
    );
  };

  return Board;
}(React.Component);

var Game = function (_React$Component2) {
  _inherits(Game, _React$Component2);

  function Game() {
    _classCallCheck(this, Game);

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this3.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: Array(9).fill(""),
        player: Array(9).fill("")
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: true
    };
    return _this3;
  }

  Game.prototype.handleClick = function handleClick(i) {
    var history = this.state.history;
    var current = history[history.length - 1];
    var squares = current.squares.slice();
    var pos = current.pos.slice();
    var player = current.player.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    pos[history.length - 1] = '(' + Math.floor(i / 3 + 1) + ',' + (i % 3 + 1) + ')';
    player[history.length - 1] = squares[i];
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: pos,
        player: player
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  };

  Game.prototype.jumpTo = function jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true
    });
  };

  Game.prototype.toggleSort = function toggleSort() {
    this.setState({
      sort: !this.state.sort
    });
  };

  Game.prototype.render = function render() {
    var _this4 = this;

    var history = this.state.history;
    var current = history[this.state.stepNumber];
    var winnerData = calculateWinner(current.squares);
    var winner = winnerData ? winnerData.winner : null;
    var winnerLine = winnerData ? winnerData.line : [];
    var moves = history.map(function (step, move) {
      var recPos = current.pos[move - 1];
      var recPlayer = current.player[move - 1];
      var desc = move ? 'Move #' + move + ': ' + recPlayer + ' ' + recPos : 'Game start';
      return React.createElement(
        "li",
        { key: move },
        React.createElement(
          "a",
          { href: "#", onClick: function onClick() {
              return _this4.jumpTo(move);
            } },
          desc
        )
      );
    });

    var status = undefined;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return React.createElement(
      "div",
      { className: "game" },
      React.createElement(
        "div",
        { className: "game-board" },
        React.createElement(Board, {
          squares: current.squares,
          onClick: function onClick(i) {
            return _this4.handleClick(i);
          },
          status: status,
          winnerLine: winnerLine
        })
      ),
      React.createElement(
        "div",
        { className: "game-info" },
        React.createElement(
          "button",
          { onClick: function onClick() {
              return _this4.toggleSort();
            } },
          "toggle"
        ),
        function () {
          return _this4.state.sort ? React.createElement(
            "ol",
            null,
            moves
          ) : React.createElement(
            "ol",
            null,
            moves.reverse()
          );
        }()
      )
    );
  };

  return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('container'));

function calculateWinner(squares) {
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = lines[i];
    var a = _lines$i[0];
    var b = _lines$i[1];
    var c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a],
        line: [a, b, c]
      }; // winner & line data
    }
  }
  return null;
}

export default App;
