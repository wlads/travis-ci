Travis.Log = {
  FOLDS: {
    schema:  /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:schema:load[\s\S]*?<p.*?\/a>-- assume_migrated_upto_version[\s\S]*?<\/p>\n<p.*?\/a>.*<\/p>)/gm,
    migrate: /(<p.*?\/a>\$ (?:bundle exec )?rake( db:create)? db:migrate[\s\S]*== +\w+: migrated \(.*\) =+)/gm,
    bundle:  /(<p.*?\/a>\$ bundle install.*<\/p>\n(<p.*?\/a>(Updating|Using|Installing|Fetching|remote:|Receiving|Resolving).*?<\/p>\n|<p.*?\/a><\/p>\n)*)/gm,
    exec:    /(<p.*?\/a>[\/\w]*.rvm\/rubies\/[\S]*?\/(ruby|rbx|jruby) .*?<\/p>)/g
  },

  filter: function(log) {
    // log = this.stripPaths(log);
    log = this.escapeHtml(log);
    log = this.deansi(log);
    log = log.replace(/\r/g, '');
    log = this.numberLines(log);
    log = this.fold(log);
    log = log.replace(/\n/g, '');
    return log;
  },

  stripPaths: function(log) {
    return log.replace(/\/home\/vagrant\/builds(\/[^\/\n]+){2}\//g, '');
  },

  escapeHtml: function(log) {
    return Handlebars.Utils.escapeExpression(log);
  },

  escapeRuby: function(log) {
    return log.replace(/#<(\w+.*?)>/, '#&lt;$1&gt;');
  },

  numberLines: function(log) {
    var result = '';
    $.each(log.trim().split('\n'), function (ix, line) {
      var path = Travis.Log.location().substr(1).replace(/\/L\d+/, '') + '/L' + (ix + 1);
      result += '<p><a href="#%@" id="%@" name="L%@">%@</a>%@</p>\n'.fmt(path, path, (ix + 1), (ix + 1), line);
    });
    return result.trim();
  },

  deansi: function(log) {
    //
    // Following replaces ANSI sequences responsible for erasing lines and
    // carret returns. Lack of those causes progress bars and such to fail
    // miserably.
    //
    log = log
            .replace(/\r\r/g, '\r')
            .replace(/\033\[K\r/g, '\r')
            .replace(/^.*\r(?!$)/gm, '')
            .replace(/\[2K/g, '');

    var ansi = ansiparse(log),
        text = '';

    ansi.forEach(function (part) {
      var classes = [];

      part.foreground && classes.push(part.foreground);
      part.background && classes.push('bg-' + part.background);
      part.bold       && classes.push('bold');
      part.italic     && classes.push('italic');

      text += classes.length
            ? ('<span class="' + classes.join(' ') + '">' + part.text + '</span>')
            : part.text;
    });
    return text.replace(/\033\(B/, "");
  },

  fold: function(log) {
    log = this.unfold(log);
    var folds = 0;
    $.each(Travis.Log.FOLDS, function(name, pattern) {
      log = log.replace(pattern, function() {
        //
        // Maintaining fold's open or closed state is done as follows:
        // when fold is initially created, it's given an ID, `fold-<fold-number>`.
        // During next folding, we check for presence and state of
        // `fold-<fold-number>` (thanks to the fact that logs are not buffered).
        // If it's open, we append `open` class to classes of newly created log,
        // thus maitaining it's state.
        //
        var foldId = 'fold-' + (folds++);
        var previousFold = document.getElementById('fold-' + foldId);
        var classList = 'fold ' + name;

        if (previousFold && previousFold.classList.contains('open')) {
          classList += ' open';
        }

        return '<div class="' + classList + '" id="' + foldId + '">' +
          arguments[1].trim() + '</div>';
      });
    });
    return log;
  },

  unfold: function(log) {
    return log.replace(/<div class="fold[^"]*">([\s\S]*?)<\/div>/mg, '$1\n');
  },

  location: function() { // need something to spy on in tests
    return window.location.hash;
  }
};
