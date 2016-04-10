var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

//WebStorm does this automatically
/*gulp.task("babel", function () {
    return gulp.src("script.js")
        .pipe(babel())
        .pipe(gulp.dest("src"));
});*/

gulp.task("scripts", function () {
    return gulp.src(["src/index.html", "src/moment.js", "src/script-compiled.js", "src/index-end-of-file.html"])
        .pipe(concat("hw-card-creator-compiled.html"))
        .pipe(gulp.dest("./build"));
});

gulp.task('default', ['scripts']);

gulp.task('watch', function() {
    gulp.watch('src/*',['scripts']);
})