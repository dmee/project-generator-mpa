const gulp = require("gulp");
const del = require("del");
const $ = require("gulp-load-plugins")();

/************************** LESS ******************************/
// Less公用文件
gulp.task("less-common", () => {
    gulp.src([
            "src/plugins/animate.css/animate.min.css",
            "src/plugins/dmui/dist/dm.min.css",
            "src/styles/common.less", "src/styles/common/**/*"
        ])
        .pipe($.plumber())
        .pipe($.concat("common.css"))
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe($.cleanCss())
        .pipe(gulp.dest("dist/styles"));
});
// Less模块文件-开发模式
gulp.task("less-dev-module", () => {
    gulp.src(["src/styles/**/*.less", "!src/styles/common.less", "!src/styles/common/**/*.less"])
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest("dist/styles"));
});
// Less-开发模式
gulp.task("less-dev", ["less-common", "less-dev-module"]);

// Less模块文件-线上模式
gulp.task("less-build-module", () => {

    gulp.src(["src/styles/**/*.less", "!src/styles/common.less", "!src/styles/common/**/*.less"])
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe($.cleanCss())
        .pipe(gulp.dest("dist/styles"));
});
// Less-线上模式
gulp.task("less-build", ["less-common", "less-build-module"]);

/************************** Scripts ******************************/
// script-插件包
gulp.task("script-bundle", () => {
    gulp.src([
            "src/plugins/jquery/dist/jquery.min.js",
            "src/plugins/js-md5/build/md5.min.js",
            "src/plugins/dmui/dist/dm.min.js"
        ])
        .pipe($.plumber())
        .pipe($.concat("bundle.js"))
        .pipe(gulp.dest("dist/scripts"));
});
// script-公用模块-开发模式
gulp.task("script-common-dev", () => {
    gulp.src([
            "src/scripts/common/**/*.js"
        ])
        .pipe($.plumber())
        .pipe($.concat("common.js"))
        .pipe($.babel())
        .pipe(gulp.dest("dist/scripts"));

});
// script-功能模块-开发模式
gulp.task("script-fn-dev", () => {
    gulp.src(["src/scripts/**/*.js", "!src/scripts/common/**/*.js"])
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest("dist/scripts"));
});
// script-开发模式打包
gulp.task("script-dev", ["script-bundle", "script-common-dev", "script-fn-dev"]);

// pages-打包
gulp.task('pages', () => {
    gulp.src(["src/*.html", "src/pages/**/*.html"])
        .pipe($.plumber())
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest("dist"));
});

/************************** Other ******************************/
// 图片拷贝
gulp.task("copy-assets", () => {
    gulp.src('src/assets/**/*').pipe($.plumber()).pipe(gulp.dest('./dist/assets'));
});

// 清理文件夹
gulp.task("clean", () => {
    del.sync(__dirname + "/dist");
});

// 监听任务
gulp.task("watch", done => {
    $.livereload.listen();
    gulp.watch(["src/framework/**/*"], ["framework"]); // 框架监听
    gulp.watch(["src/plugins/**/*"], ["script-bundle", "less-common"]); // 插件监听
    gulp.watch(["src/styles/**/*"], ["less-dev"]); // 样式监听
    gulp.watch(["src/scripts/**/*"], ["script-dev"]); // 样式监听
    gulp.watch(["src/assets/**/*"], ["copy-assets"]); // 资源监听
    gulp.watch(["src/**/*.html"], ["pages"]); // 页面监听

    // 输出监听
    gulp.watch(["dist/**/*"], file => {
        setTimeout(() => {
            $.livereload.changed(file.path);
        }, 600);
    });
});

gulp.task("common", ["copy-assets", "pages"]);
// 主任务
gulp.task("build", ["common", "less-build"]);
gulp.task("dev", ["common", "less-dev", "script-dev", "watch"]);
gulp.task("default", ["dev"]);