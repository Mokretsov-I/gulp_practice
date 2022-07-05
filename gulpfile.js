const project_folder = "dist";
const sours_folder = "src";

const path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [sours_folder + "/*.html", "!" + sours_folder + "/_*.html"],
		css: sours_folder + "/scss/style.scss",
		js: sours_folder + "/js/script.js",
		img: sours_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
		fonts: sours_folder + "/fonts/*.ttf",
	},
	watch: {
		html: sours_folder + "/**/*.html",
		css: sours_folder + "/scss/**/*.scss",
		js: sours_folder + "/js/**/*.js",
		img: sours_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp}",
	},
	clean: "./" + project_folder + "/",
};

const { src, dest } = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileiclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass")(require("sass")),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-image"),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2");

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3300,
		notify: false,
	});
}

function html() {
	return src(path.src.html).pipe(fileiclude()).pipe(webphtml()).pipe(dest(path.build.html)).pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(scss({ outputStyle: "expanded" }))
		.pipe(group_media())
		.pipe(
			autoprefixer({
				overriderBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(fileiclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				pngquant: true,
				optipng: true,
				zopflipng: true,
				jpegRecompress: false,
				mozjpeg: true,
				gifsicle: true,
				svgo: true,
				concurrent: 10,
				quiet: true,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

function fonts(params) {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.js = js;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
