#!/bin/zsh

# Check if an operation is provided
if [ -z "$1" ]; then
  echo "Error: No operation provided."
  echo "Usage: $0 [create <input_string> | up | down]"
  exit 1
fi

operation=$1
input_string=$2

case $operation in
  create)
    # Check if an input string is provided for the create operation
    if [ -z "$input_string" ]; then
      echo "Error: No input string provided for create operation."
      echo "Usage: $0 create <input_string>"
      exit 1
    fi

    # Get the current timestamp in the format YYYYMMDDHHMMSS
    timestamp=$(date +"%Y%m%d%H%M%S")

    # Create the filename with the format <timestamp>_<input_string>.ts
    filename="migrations/${timestamp}_$input_string.ts"

    # Create the file with the required content
    cat <<EOF > "$filename"
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
EOF

    # Print success message
    echo "Migration file created: $filename"
    ;;

  up)
    # Run migrate.ts with the "up" argument
    echo "Running migrations up..."
    ts-node migrate.ts up
    ;;

  down)
    # Run migrate.ts with the "down" argument
    echo "Running migrations down..."
    ts-node migrate.ts down
    ;;

  *)
    echo "Error: Invalid operation."
    echo "Usage: $0 [create <input_string> | up | down]"
    exit 1
    ;;
esac
