import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    
    # Allow passing custom arguments, default to runserver 8000
    args = sys.argv.copy()
    if len(args) == 1:
        args.extend(['runserver', '8000'])
    
    execute_from_command_line(args)

if __name__ == '__main__':
    main()
