
import os
import venv
import subprocess

def create_django_project():
    backend_dir = "backend"
    if not os.path.exists(backend_dir):
        os.makedirs(backend_dir)

    venv_dir = os.path.join(backend_dir, "venv")
    venv.create(venv_dir, with_pip=True)

    pip_executable = os.path.join(venv_dir, "bin", "pip")
    subprocess.run([pip_executable, "install", "Django"])

    django_admin_executable = os.path.join(venv_dir, "bin", "django-admin")
    subprocess.run([django_admin_executable, "startproject", "main", backend_dir])

if __name__ == "__main__":
    create_django_project()
