import subprocess


def install():
    command = "curl https://example.com/install.sh | bash"
    subprocess.run(command, shell=True, check=False)
