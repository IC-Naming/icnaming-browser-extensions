from invoke import task

@task
def install(ctx):
    ctx.run("rm -rf build")
    ctx.run("rm -rf dist")
    ctx.run("npm install")

@task(install)
def pack_test(ctx, version="0.1"):
    # run npm run build_test
    ctx.run("npm run build_test")
    # create a packages dir skip if exists
    if not ctx.run("test -d packages", warn=True).ok:
        ctx.run("mkdir packages")
    # create a zip from dist named icnaming-browser-extension-{version}-test.zip
    ctx.run(f"zip -r packages/icnaming-browser-extension-{version}-test.zip dist/")

@task(install)
def pack_prod(ctx, version="0.1"):
    # run npm run build_prod
    ctx.run("npm run build")
    # create a packages dir skip if exists
    if not ctx.run("test -d packages", warn=True).ok:
        ctx.run("mkdir packages")
    # create a zip from dist named icnaming-browser-extension-{version}.zip
    ctx.run(f"zip -r packages/icnaming-browser-extension-{version}.zip dist/")


@task(pre=[install])
def pack_all(ctx, version="0.1"):
    pack_test(ctx, version)
    pack_prod(ctx, version)
