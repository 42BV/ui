#!/bin/sh
PS3="Choose what kind of publish: "
options=("Development" "Production")

if [ -z $ENV ]; then
    select opt in "${options[@]}"; do
        case $opt in
        "Development")
            ENV=dev
            break
            ;;
        *)
            printf -- "\033[33m Invalid choice, defaulting to development \033[0m\n"
            break
            ;;
        esac
    done
fi

if [ $ENV == 'dev' ]; then

    # Check if docker exists
    if [[ "$(docker -v 2> /dev/null)" == "" ]]; then
        printf -- 'You dont seem to have Docker installed.\n'
        printf -- 'Get it: https://www.docker.com/community-edition\n'
        printf -- 'Exiting with code 127...\n'
        exit 127
    fi

    printf -- 'Docker found.\n'

    if [ "$(docker ps -q -f name=verdaccio)" ]; then
        printf -- '\033[37m Verdaccio already running, pulling down... \033[0m\n'
        docker stop verdaccio >/dev/null 2>&1
        printf -- '\033[32m SUCCESS: Pulled down Verdaccio instance \033[0m\n'
    fi

    printf -- '\033[37m Starting verdaccio... \033[0m\n'
    docker run -d -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio:4.2.1 >/dev/null 2>&1
    docker start verdaccio 2>&1
    until $(curl --output /dev/null --silent --head --fail http://localhost:4873); do
        printf '.'
        sleep 1
    done
    printf -- '\033[32m SUCCESS: Verdaccio is now running \033[0m\n'

    printf -- '\033[37m Creating verdaccio user... \033[0m\n'
    /usr/bin/expect <<EOD
        spawn npm adduser --registry http://localhost:4873
        expect {
            "Username:" {send "test\r"; exp_continue}
            "Password:" {send "test\r"; exp_continue}
            "Email: (this IS public)" {send "test@test@42.nl\r"; exp_continue}
        }
EOD
    printf -- '\033[32m SUCCESS: verdaccio user created \033[0m\n'
    
    # Rewrite versions of all package.json's for publishing
    node ./scripts/rewrite-versions

    # Publish packages
    printf -- '\033[37m Attempting to publish... \033[0m\n'
    lerna exec 'npm publish --registry http://localhost:4873'
    printf -- '\033[32m SUCCESS: Succesfully published packages \033[0m\n'

    # Restoring versions to their old version numbers.
    node ./scripts/restore-versions
fi
