"use client";
"use strict";
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
exports.__esModule = true;
function SnippetsPage() {
  var snippets = react_1.useQuery(api_1.api.snippets.getSnippets);
  var _a = react_2.useState(""),
    searchQuery = _a[0],
    setSearchQuery = _a[1];
  var _b = react_2.useState(null),
    selectedLanguage = _b[0],
    setSelectedLanguage = _b[1];
  var _c = react_2.useState("grid"),
    view = _c[0],
    setView = _c[1];
  // loading state
  if (snippets === undefined) {
    return React.createElement(
      "div",
      { className: "min-h-screen" },
      React.createElement(NavigationHeader_1["default"], null),
      React.createElement(SnippetsPageSkeleton_1["default"], null)
    );
  }
  var languages = __spreadArrays(
    new Set(
      snippets.map(function (s) {
        return s.language;
      })
    )
  );
  var popularLanguages = languages.slice(0, 5);
  var filteredSnippets = snippets.filter(function (snippet) {
    var matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase());
    var matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });
  return React.createElement(
    "div",
    { className: "min-h-screen bg-[#0a0a0f]" },
    React.createElement(NavigationHeader_1["default"], null),
    React.createElement(
      "div",
      { className: "relative max-w-7xl mx-auto px-4 py-12" },
      React.createElement(
        "div",
        { className: "text-center max-w-3xl mx-auto mb-16" },
        React.createElement(
          framer_motion_1.motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className:
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r\n             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6",
          },
          React.createElement(lucide_react_1.BookOpen, {
            className: "w-4 h-4",
          }),
          "Community Code Library"
        ),
        React.createElement(
          framer_motion_1.motion.h1,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className:
              "text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6",
          },
          "Discover & Share Code Snippets"
        ),
        React.createElement(
          framer_motion_1.motion.p,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.2 },
            className: "text-lg text-gray-400 mb-8",
          },
          "Explore a curated collection of code snippets from the community"
        )
      ),
      React.createElement(
        "div",
        { className: "relative max-w-5xl mx-auto mb-12 space-y-6" },
        React.createElement(
          "div",
          { className: "relative group" },
          React.createElement("div", {
            className:
              "absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500",
          }),
          React.createElement(
            "div",
            { className: "relative flex items-center" },
            React.createElement(lucide_react_1.Search, {
              className: "absolute left-4 w-5 h-5 text-gray-400",
            }),
            React.createElement("input", {
              type: "text",
              value: searchQuery,
              onChange: function (e) {
                return setSearchQuery(e.target.value);
              },
              placeholder: "Search snippets by title, language, or author...",
              className:
                "w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white\n                  rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200\n                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
            })
          )
        ),
        React.createElement(
          "div",
          { className: "flex flex-wrap items-center gap-4" },
          React.createElement(
            "div",
            {
              className:
                "flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800",
            },
            React.createElement(lucide_react_1.Tag, {
              className: "w-4 h-4 text-gray-400",
            }),
            React.createElement(
              "span",
              { className: "text-sm text-gray-400" },
              "Languages:"
            )
          ),
          popularLanguages.map(function (lang) {
            return React.createElement(
              "button",
              {
                key: lang,
                onClick: function () {
                  return setSelectedLanguage(
                    lang === selectedLanguage ? null : lang
                  );
                },
                className:
                  "\n                    group relative px-3 py-1.5 rounded-lg transition-all duration-200\n                    " +
                  (selectedLanguage === lang
                    ? "text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50"
                    : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800") +
                  "\n                  ",
              },
              React.createElement(
                "div",
                { className: "flex items-center gap-2" },
                React.createElement("img", {
                  src: "/" + lang + ".png",
                  alt: lang,
                  className: "w-4 h-4 object-contain",
                }),
                React.createElement("span", { className: "text-sm" }, lang)
              )
            );
          }),
          selectedLanguage &&
            React.createElement(
              "button",
              {
                onClick: function () {
                  return setSelectedLanguage(null);
                },
                className:
                  "flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors",
              },
              React.createElement(lucide_react_1.X, { className: "w-3 h-3" }),
              "Clear"
            ),
          React.createElement(
            "div",
            { className: "ml-auto flex items-center gap-3" },
            React.createElement(
              "span",
              { className: "text-sm text-gray-500" },
              filteredSnippets.length,
              " snippets found"
            ),
            React.createElement(
              "div",
              {
                className:
                  "flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800",
              },
              React.createElement(
                "button",
                {
                  onClick: function () {
                    return setView("grid");
                  },
                  className:
                    "p-2 rounded-md transition-all " +
                    (view === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"),
                },
                React.createElement(lucide_react_1.Grid, {
                  className: "w-4 h-4",
                })
              ),
              React.createElement(
                "button",
                {
                  onClick: function () {
                    return setView("list");
                  },
                  className:
                    "p-2 rounded-md transition-all " +
                    (view === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"),
                },
                React.createElement(lucide_react_1.Layers, {
                  className: "w-4 h-4",
                })
              )
            )
          )
        )
      ),
      React.createElement(
        framer_motion_1.motion.div,
        {
          className:
            "grid gap-6 " +
            (view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 max-w-3xl mx-auto"),
          layout: true,
        },
        React.createElement(
          framer_motion_1.AnimatePresence,
          { mode: "popLayout" },
          filteredSnippets.map(function (snippet) {
            return React.createElement(SnippetCard_1["default"], {
              key: snippet._id,
              snippet: snippet,
            });
          })
        )
      ),
      filteredSnippets.length === 0 &&
        React.createElement(
          framer_motion_1.motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className:
              "relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden",
          },
          React.createElement(
            "div",
            { className: "text-center" },
            React.createElement(
              "div",
              {
                className:
                  "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br \n                from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6",
              },
              React.createElement(lucide_react_1.Code, {
                className: "w-8 h-8 text-gray-400",
              })
            ),
            React.createElement(
              "h3",
              { className: "text-xl font-medium text-white mb-3" },
              "No snippets found"
            ),
            React.createElement(
              "p",
              { className: "text-gray-400 mb-6" },
              searchQuery || selectedLanguage
                ? "Try adjusting your search query or filters"
                : "Be the first to share a code snippet with the community"
            ),
            (searchQuery || selectedLanguage) &&
              React.createElement(
                "button",
                {
                  onClick: function () {
                    setSearchQuery("");
                    setSelectedLanguage(null);
                  },
                  className:
                    "inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 hover:text-white rounded-lg \n                    transition-colors",
                },
                React.createElement(lucide_react_1.X, { className: "w-4 h-4" }),
                "Clear all filters"
              )
          )
        )
    )
  );
}
exports["default"] = SnippetsPage;
