(function ($) {
  $(window).ready(function () {
    class Game {
      self = this;
      cell_clicked: any = false;
      selector = {
        game_box: $(".game_box"),
        game: $(".game"),
        game_header: $(".game_header"),
        game_content: $(".game_content"),
        game_layer: $(".game_layer"),
        game_layer_running: $(".game_layer.running"),
        game_cell_box: $(".game_cell_box"),
        game_level: $(".game_level"),
        game_runtime_box: $(".game_runtime"),
        game_runtime: $(".game_runtime_running"),
        btn_mute: $(".btn_mute"),
        btn_hint: $(".btn_hint"),
        hint_left: $(".hint_left"),
      };
      data = {
        container_width: this.selector.game_content.width(),
        container_height: this.selector.game_content.height(),
        container_ratio:
          this.selector.game_content.width() /
          this.selector.game_content.height(),
        level_current: 0,
        image_duplicate: 4,
        image_folder: "assets/img/cell/",
        image_ratio: 1,
        cell_clicked: this.cell_clicked,
        wait_time: false,
        cell_effect_time: 200,
        cell_complete: 0,
        cell_total: 0,
        cell_total_h: 0,
        cell_total_v: 0,
        timeleft: 0,
        timeTotal: 0,
        timeleft_timeout: false,
        hintleft: 0,
        resize_timeout: false,
        // sound_ready: new buzz.sound("assets/sound/ready", {
        //   formats: ["mp3"],
        // }),
        // sound_open: new buzz.sound("assets/sound/open", {
        //   formats: ["mp3"],
        // }),
        // sound_matched: new buzz.sound("assets/sound/matched", {
        //   formats: ["mp3"],
        // }),
        // sound_not_matched: new buzz.sound("assets/sound/not_matched", {
        //   formats: ["mp3"],
        // }),
        mute: false,
      };

      level = [
        {
          image_count: 24,
          timeleft: 5 * 60,
          hintleft: 10,
        },
        {
          image_count: 30,
          timeleft: 7 * 60,
          hintleft: 9,
        },
        {
          image_count: 36,
          timeleft: 9 * 60,
          hintleft: 5,
        },
        {
          image_count: 24,
          timeleft: 4 * 60,
          hintleft: 3,
        },
        {
          image_count: 30,
          timeleft: 5 * 60,
          hintleft: 4,
        },
        {
          image_count: 36,
          timeleft: 6 * 60,
          hintleft: 5,
        },
        {
          image_count: 24,
          timeleft: 4 * 60,
          hintleft: 1,
        },
        {
          image_count: 30,
          timeleft: 5 * 60,
          hintleft: 2,
        },
        {
          image_count: 36,
          timeleft: 6 * 60,
          hintleft: 3,
        },
      ];

      // update_time = function () {
      //   this.data.timeleft--;
      //   var percent =
      //     100 - (this.data.timeleft / this.data.timeTotal) * 100 + "%";
      //   this.selector.game_runtime.css({
      //     height: percent,
      //   });
      //   if (this.data.timeleft > 0) {
      //     this.data.timeleft_timeout = setTimeout(function () {
      //       this.self.update_time();
      //     }, 1000);
      //   } else {
      //     this.start();
      //   }
      // };

      render_level = function (level: any, self: Game) {
        this.selector.game_level.html(level + 1);
        this.selector.hint_left.html(this.data.hintleft);

        var image_count = this.level[level].image_count;
        this.data.cell_total = image_count * this.data.image_duplicate;
        /*
         * Calculator for game data at this level
         */
        var ar = [];
        for (var i = 1; i <= image_count; i++) {
          for (var j = 0; j < this.data.image_duplicate; j++) {
            ar.push({
              image:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                i +
                ".png",
              image_index: i,
            });
          }
        }
        /*
         * randomly
         */
        var temp = "";
        var idx1 = 0;
        var idx2 = 0;
        for (var i = 0; i < this.data.cell_total * 2; i++) {
          idx1 = supperrand(0, this.data.cell_total - 1);
          idx2 = supperrand(0, this.data.cell_total - 1);
          if (idx1 != idx2) {
            temp = ar[idx1];
            ar[idx1] = ar[idx2];
            ar[idx2] = temp;
          }
        }

        var division = null;
        for (var i = 1; i < Math.sqrt(this.data.cell_total); i++) {
          if (this.data.cell_total % i == 0) {
            var h: any = i;
            var v: any = this.data.cell_total / i;
            if (
              (h < v &&
                this.data.container_width > this.data.container_height) ||
              (h > v && this.data.container_width < this.data.container_height)
            ) {
              var temp: string = h;
              h = v;
              v = temp;
            }
            var ratio_best_math = Math.abs(
              (h / v) * this.data.image_ratio - this.data.container_ratio
            );
            var division_advice = {
              h: h,
              v: v,
              ratio_best_math: ratio_best_math,
            };
            if (division == null) {
              division = division_advice;
            } else if (division.ratio_best_math > ratio_best_math) {
              division = division_advice;
            }
          }
        }
        this.data.cell_total_h = division.h;
        this.data.cell_total_v = division.v;
        /*
         * Render the game cell depend on game data just calculator above
         */
        ar.forEach(function (item, index) {
          var x = index % self.data.cell_total_h;
          var y = chianguyen(index, self.data.cell_total_h);
          self.selector.game_cell_box.append(
            "<img style='left: " +
              (x / self.data.cell_total_h) * 100 +
              "%; top: " +
              (y / self.data.cell_total_v) * 100 +
              "%' class='game_cell' src='" +
              item.image +
              "' id='cell_" +
              x +
              "_" +
              y +
              "' data-image-index='" +
              item.image_index +
              "' data-x='" +
              x +
              "' data-y='" +
              y +
              "'>"
          );
        });
        for (var i = 1; i < Math.sqrt(this.data.cell_total); i++) {
          if (this.data.cell_total % i == 0) {
            var h: any = i;
            var v: any = this.data.cell_total / i;
            if (
              (h < v &&
                this.data.container_width > this.data.container_height) ||
              (h > v && this.data.container_width < this.data.container_height)
            ) {
              var temp: string = h;
              h = v;
              v = temp;
            }
            var ratio_best_math = Math.abs(
              (h / v) * this.data.image_ratio - this.data.container_ratio
            );
            var division_advice = {
              h: h,
              v: v,
              ratio_best_math: ratio_best_math,
            };
            if (division == null) {
              division = division_advice;
            } else if (division.ratio_best_math > ratio_best_math) {
              division = division_advice;
            }
          }
        }
        for (var i = 0; i < this.data.cell_total * 2; i++) {
          idx1 = supperrand(0, this.data.cell_total - 1);
          idx2 = supperrand(0, this.data.cell_total - 1);
          if (idx1 != idx2) {
            temp = ar[idx1];
            ar[idx1] = ar[idx2];
            ar[idx2] = temp;
          }
        }
        ar.forEach(function (item, index) {
          var x = index % self.data.cell_total_h;
          var y = chianguyen(index, self.data.cell_total_h);
          self.selector.game_cell_box.append(
            "<img style='left: " +
              (x / self.data.cell_total_h) * 100.8 +
              "%; top: " +
              (y / self.data.cell_total_v) * 100.8 +
              "%' class='game_cell tttt' src='" +
              item.image +
              "' id='cell_" +
              x +
              "_" +
              y +
              "' data-image-index='" +
              item.image_index +
              "' data-x='" +
              x +
              "' data-y='" +
              y +
              "'>"
          );
        });

        self.selector.game_cell_box.append("<div class='clear_both'></div>");
        /*
         * Find the hint and auto random cell if not found
         */
        this.auto_random_cell();
        /*
         * Event trigger
         */
        self.selector.game_cell_box.find(".game_cell").click(function () {
          self.cell_click($(this), self);
        });
        self.selector.game_cell_box.find(".game_cell").css({
          width: 100 / self.data.cell_total_h + "%",
          height: 100 / self.data.cell_total_v + "%",
        });
        if (this.data.mute == false) {
          // this.playsound(this.data.sound_ready);
        }

        /*
         * Style for game just rendered above
         */
        this.resize();
      };

      cell_click = function (cell: any, self: Game) {
        if (
          cell.hasClass("complete") ||
          cell.hasClass("open") ||
          this.data.wait_time == true
        ) {
          /*
           * This cell is complete before
           * or in the waiting time for calculating the effect
           */
          return;
        } else if (this.data.cell_clicked == false) {
          /*
           * Click at first of pair cell
           */
          if (!cell.hasClass("hint")) {
            this.unhint();
          }
          this.data.cell_clicked = cell;
          cell.addClass("open");
          if (this.data.mute == false) {
            // this.playsound(this.data.sound_open);
          }
        } else {
          /*
           * Click at second of pair cell
           * Check matches cell
           */
          this.data.wait_time = true;
          if (!cell.hasClass("hint")) {
            this.unhint();
          }
          var matched_path = false;
          if (
            cell.data("image-index") ==
            this.data.cell_clicked.data("image-index")
          ) {
            // matched_path = true;
            matched_path = this.check_has_path(
              this.cell_to_pointer(this.data.cell_clicked),
              this.cell_to_pointer(cell)
            );
          }
          if (matched_path == false) {
            /*
             * The cells is not matched
             */
            cell.addClass("not_matched");
            this.data.cell_clicked.removeClass("open").addClass("not_matched");
            if (this.data.mute == false) {
              // this.playsound(this.data.sound_not_matched);
            }
            setTimeout(function () {
              cell.removeClass("not_matched");
              self.data.cell_clicked.removeClass("not_matched");
              self.data.cell_clicked = false;
              self.data.wait_time = false;
            }, this.data.cell_effect_time);
          } else {
            /*
             * The cells is matched
             */
            cell.addClass("matched");
            this.data.cell_clicked.removeClass("open").addClass("matched");
            if (this.data.mute == false) {
              // this.playsound(this.data.sound_matched);
            }
            setTimeout(function () {
              cell.removeClass("matched").addClass("complete");
              self.data.cell_clicked
                .removeClass("matched")
                .addClass("complete");
              self.data.cell_clicked = false;
              self.data.cell_complete += 2;
              if (self.data.cell_complete >= self.data.cell_total) {
                /*
                 * Complete the current level
                 */
                self.nextlevel();
              } else {
                self.auto_random_cell();
              }
              self.data.wait_time = false;
            }, this.data.cell_effect_time);
          }
        }
      };

      check_has_path_1 = function (pointer_1, pointer_2) {
        if (pointer_1.x == pointer_2.x && pointer_1.y == pointer_2.y) {
          return false;
        }
        if (pointer_1.x == pointer_2.x || pointer_1.y == pointer_2.y) {
          if (pointer_1.x == pointer_2.x) {
            var delta_x = 0;
            var delta_y = 1;
            if (pointer_2.y < pointer_1.y) {
              var delta_y = -1;
            }
          } else {
            var delta_y = 0;
            var delta_x = 1;
            if (pointer_2.x < pointer_1.x) {
              var delta_x = -1;
            }
          }
          var ar_path = [];
          var w_flag = true;
          var i = 0;
          while (w_flag) {
            var pointer_current = {
              x: pointer_1.x + i * delta_x,
              y: pointer_1.y + i * delta_y,
            };
            if (
              pointer_current.x == pointer_1.x &&
              pointer_current.y == pointer_1.y
            ) {
              ar_path.push(pointer_current);
            } else {
              if (
                pointer_current.x == pointer_2.x &&
                pointer_current.y == pointer_2.y
              ) {
                ar_path.push(pointer_current);
                return ar_path;
              }
              if (this.check_pointer_is_out(pointer_current)) {
                ar_path.push(pointer_current);
              } else {
                if (
                  !this.pointer_to_cell(pointer_current).hasClass("complete")
                ) {
                  return false;
                }
              }
            }
            i++;
          }
        }
        return false;
      };

      check_has_path_2 = function (pointer_1, pointer_2) {
        if (pointer_1.x == pointer_2.x || pointer_1.y == pointer_2.y) {
          return false;
        }
        var pointer = {
          x: pointer_1.x,
          y: pointer_2.y,
        };
        var path = this.check_has_path_of_three(pointer_1, pointer, pointer_2);
        if (path != false) {
          return path;
        }
        var pointer = {
          x: pointer_2.x,
          y: pointer_1.y,
        };
        var path = this.check_has_path_of_three(pointer_1, pointer, pointer_2);
        if (path != false) {
          return path;
        }
        return false;
      };
      check_has_path_3 = function (pointer_1, pointer_2) {
        if (pointer_1.x != pointer_2.x) {
          for (var i = -1; i <= this.data.cell_total_v; i++) {
            if (i != pointer_1.y && i != pointer_2.y) {
              var pointer_3 = {
                x: pointer_1.x,
                y: i,
              };
              var pointer_4 = {
                x: pointer_2.x,
                y: i,
              };
              var path = this.check_has_path_of_four(
                pointer_1,
                pointer_3,
                pointer_4,
                pointer_2
              );
              if (path != false) {
                return path;
              }
            }
          }
        }
        if (pointer_1.y != pointer_2.y) {
          for (var i = -1; i <= this.data.cell_total_h; i++) {
            if (i != pointer_1.x && i != pointer_2.x) {
              var pointer_3: { x: any; y: number } = {
                x: i,
                y: pointer_1.y,
              };
              var pointer_4: { x: any; y: number } = {
                x: i,
                y: pointer_2.y,
              };
              var path = this.check_has_path_of_four(
                pointer_1,
                pointer_3,
                pointer_4,
                pointer_2
              );
              if (path != false) {
                return path;
              }
            }
          }
        }

        return false;
      };

      check_has_path_of_three = function (pointer_1, pointer_2, pointer_3) {
        if (!this.check_pointer_is_out(pointer_2)) {
          if (!this.pointer_to_cell(pointer_2).hasClass("complete")) {
            return false;
          }
        }
        var path_1 = this.check_has_path_1(pointer_1, pointer_2);
        if (path_1 == false) {
          return false;
        }
        var path_2 = this.check_has_path_1(pointer_2, pointer_3);
        if (path_2 == false) {
          return false;
        }
        var path = [];
        path_1.forEach(function (item, index) {
          path.push(item);
        });

        path_2.forEach(function (item, index) {
          path.push(item);
        });
        return path;
      };

      check_has_path_of_four = function (
        pointer_1,
        pointer_2,
        pointer_3,
        pointer_4
      ) {
        if (!this.check_pointer_is_out(pointer_2)) {
          if (!this.pointer_to_cell(pointer_2).hasClass("complete")) {
            return false;
          }
        }
        if (!this.check_pointer_is_out(pointer_3)) {
          if (!this.pointer_to_cell(pointer_3).hasClass("complete")) {
            return false;
          }
        }
        var path_1 = this.check_has_path_1(pointer_1, pointer_2);
        if (path_1 == false) {
          return false;
        }
        var path_2 = this.check_has_path_1(pointer_2, pointer_3);
        if (path_2 == false) {
          return false;
        }
        var path_3 = this.check_has_path_1(pointer_3, pointer_4);
        if (path_3 == false) {
          return false;
        }
        var path = [];
        path_1.forEach(function (item, index) {
          path.push(item);
        });
        path_2.forEach(function (item, index) {
          path.push(item);
        });
        path_3.forEach(function (item, index) {
          path.push(item);
        });
        return path;
      };

      check_pointer_is_out = function (pointer) {
        if (pointer.x < 0 || pointer.x >= this.data.cell_total_h) {
          return true;
        }
        if (pointer.y < 0 || pointer.y >= this.data.cell_total_v) {
          return true;
        }
        return false;
      };

      cell_to_pointer = function (cell) {
        return {
          x: cell.data("x"),
          y: cell.data("y"),
        };
      };

      pointer_to_cell = function (pointer) {
        if (this.check_pointer_is_out(pointer)) {
          return false;
        }
        return $("#cell_" + pointer.x + "_" + pointer.y);
      };

      check_has_path = function (pointer_1, pointer_2) {
        var path = this.check_has_path_1(pointer_1, pointer_2);
        if (path != false) {
          return path;
        } else {
          var path = this.check_has_path_2(pointer_1, pointer_2);
          if (path != false) {
            return path;
          } else {
            var path = this.check_has_path_3(pointer_1, pointer_2);
            if (path != false) {
              return path;
            } else {
              return false;
            }
          }
        }
      };

      get_hint_by_image_index = function (image_index) {
        var cells = $('.game_cell[src="' + image_index + '"]:not(.complete)');
        var len = cells.length;
        if (len > 1) {
          for (var i = 0; i < len - 1; i++) {
            for (var j = i + 1; j < len; j++) {
              var pointer_1 = this.cell_to_pointer($(cells[i]));
              var pointer_2 = this.cell_to_pointer($(cells[j]));
              if (this.check_has_path(pointer_1, pointer_2) != false) {
                return [pointer_1, pointer_2];
              }
            }
          }
        }
        return false;
      };

      get_hint = function () {
        var cell_not_complete = $(".game_cell:not(.complete)");
        if (cell_not_complete.length > 0) {
          var image_remain = [];
          $.each(cell_not_complete, function () {
            var image_index = $(this).attr("src");
            if (image_remain.indexOf(image_index) == -1) {
              image_remain.push(image_index);
            }
          });
          if (image_remain.length > 0) {
            var len = image_remain.length;
            for (var i = 0; i < len; i++) {
              var hint_by_image_index = this.self.get_hint_by_image_index(
                image_remain[i]
              );
              if (hint_by_image_index !== false) {
                return hint_by_image_index;
              }
            }
          }
        }
        return false;
      };

      hint = function () {
        if (this.data.hintleft <= 0) {
          return false;
        }
        this.data.hintleft--;
        this.selector.hint_left.html(this.data.hintleft);
        var hint = this.get_hint();
        if (hint != false) {
          this.pointer_to_cell(hint["0"]).addClass("hint");
          this.pointer_to_cell(hint["1"]).addClass("hint");
          return;
        }
      };

      unhint = function () {
        $(".game_cell.hint").removeClass("hint");
      };

      auto_random_cell = function () {
        var hint = false;
        while (hint == false) {
          hint = this.get_hint();
          if (hint == false) {
            this.random_cell();
          }
        }
      };
      random_cell = function () {
        var cell_not_complete = $(".game_cell:not(.complete)");
        var len = cell_not_complete.length;
        if (len > 0) {
          var temp = "";
          var idx1 = 0;
          var idx2 = 0;
          var ar_src = [];
          var ar_image_index = [];
          var ar_cell = [];

          for (var i = 0; i < len; i++) {
            var cell = $(cell_not_complete[i]);
            ar_cell.push(cell);
            ar_src.push(cell.attr("src"));
            ar_image_index.push(cell.data("image-index"));
          }

          for (var i = 0; i < len; i++) {
            idx1 = supperrand(0, len - 1);
            idx2 = supperrand(0, len - 1);
            if (idx1 != idx2) {
              temp = ar_src[idx1];
              ar_src[idx1] = ar_src[idx2];
              ar_src[idx2] = temp;

              temp = ar_image_index[idx1];
              ar_image_index[idx1] = ar_image_index[idx2];
              ar_image_index[idx2] = temp;
            }
          }
          for (var i = 0; i < len; i++) {
            ar_cell[i].attr("src", ar_src[i]);
            ar_cell[i].data("image-index", ar_image_index[i]);
          }
          return true;
        }
        return false;
      };
      start = function () {
        this.refreshGameContainer();
        this.data.cell_clicked = false;
        this.data.cell_complete = 0;
        this.data.cell_total = 0;
        this.data.wait_time = false;
        this.data.timeleft = this.level[this.data.level_current].timeleft;
        this.data.timeTotal = this.data.timeleft;
        this.data.hintleft = this.level[this.data.level_current].hintleft;
        this.render_level(this.data.level_current, this.self);
        if (this.data.timeleft_timeout != false) {
          clearTimeout(this.data.timeleft_timeout);
        }
        // this.update_time();
      };
      nextlevel = function () {
        this.data.level_current++;
        if (this.data.level_current >= this.level.length) {
          this.data.level_current = 0;
        }
        this.start();
      };

      mute = function () {
        this.data.mute = true;
        this.selector.btn_mute.removeClass("stt_avaiable");
        this.selector.btn_mute.addClass("stt_tip");
      };
      unmute = function () {
        this.data.mute = false;
        this.selector.btn_mute.removeClass("stt_tip");
        this.selector.btn_mute.addClass("stt_avaiable");
      };
      playsound = function (s: any) {
        s.stop();
        s.play();
      };
      refreshGameContainer = function () {
        var headerHeight = this.selector.game_header.height();
        this.selector.game_content.css({
          top: headerHeight + 5 + "px",
        });
        this.data.container_width = this.selector.game_content.width();
        this.data.container_height = this.selector.game_content.height();
        this.data.container_ratio =
          this.data.container_width / this.data.container_height;
      };
      resize = function () {
        this.data.resize_timeout = false;
        this.refreshGameContainer();

        var box: any = {
          ratio:
            (this.data.cell_total_h / this.data.cell_total_v) *
            this.data.image_ratio,
          v: this.self.data.container_height,
        };
        box.h = box.v * box.ratio;

        if (box.h > this.self.data.container_width) {
          box.h = this.self.data.container_width;
          box.v = box.h / box.ratio;
        }
        if (box.v > this.self.data.container_height) {
          box.v = this.self.data.container_height;
          box.h = box.v * box.ratio;
        }
        if (box.h > this.self.data.container_width) {
          box.h = this.self.data.container_width;
          box.v = box.h / box.ratio;
        }

        var padding_h = (this.self.data.container_width - box.h) / 2;
        var padding_v = (this.self.data.container_height - box.v) / 2;
        var padding = padding_v + "px " + padding_h + "px";
        this.self.selector.game_layer_running.css({
          padding: padding,
        });

        this.self.selector.game_content.show();
        // this.self.selector.game_runtime_box.css({
        //   height: box.v + "px",
        //   bottom: padding_v + "px",
        // });
        // this.onresize = function (self: Game) {
        //   self.selector.game_content.hide();
        //   if (self.data.resize_timeout != false) {
        //     clearTimeout(self.data.resize_timeout);
        //   }
        //   self.data.resize_timeout = setTimeout(function () {
        //     self.resize();
        //   }, 500);
        // };
        this.selector.btn_mute.click(function () {
          if (this.self.data.mute == true) {
            this.self.unmute();
          } else {
            this.self.mute();
          }
        });
        this.selector.btn_hint.click(function (self: Game) {
          self.hint();
        });
        this.selector.game_box.on("resize", function () {
          //self.resize();
        });
        // $(window).on("resize", function () {
        //   globalThis.this.self.onresize(this.self);
        // });
      };
    }

    let greeter = new Game();
    greeter.start();
    console.log(greeter);
  });
})($);

function supperrand(l, r) {
  var a = Math.random() * (r - l + 1) + l;
  a = a - (a % 1);
  return a;
}

function chianguyen(a, b) {
  return a / b - ((a / b) % 1);
}
