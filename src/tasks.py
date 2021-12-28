from invoke import task
import shutil;
import os;

@task
def install(ctx):
    # remove files in build directory with py lib
    shutil.rmtree('build', ignore_errors=True)
    shutil.rmtree('dist', ignore_errors=True)
    ctx.run("npm install")

@task(install)
def pack_test(ctx, version="0.1"):
    # run npm run build_test
    ctx.run("npm run build_test")
    # create a packages dir skip if exists
    if not os.path.exists("packages"):
        os.makedirs("packages")
    # create a zip from dist named icnaming-browser-extension-{version}-test.zip by python lib
    shutil.make_archive("packages/icnaming-browser-extension-{version}-test".format(version=version), "zip", "dist")

@task(install)
def pack_prod(ctx, version="0.1"):
    # run npm run build_prod
    ctx.run("npm run build")
    # create a packages dir skip if exists
    if not os.path.exists("packages"):
        os.makedirs("packages")
    # create a zip from dist named icnaming-browser-extension-{version}.zip
    shutil.make_archive("packages/icnaming-browser-extension-{version}".format(version=version), "zip", "dist")


@task(pre=[install])
def pack_all(ctx, version="0.1"):
    pack_test(ctx, version)
    pack_prod(ctx, version)
