config="assets/config-*.js"

# 1st grep - extract placeholders of the format "${VARIABLE_1}" ... "${VARIABLE_2}" from JavaScript config bundle
# 2nd grep - extract variable names from placeholders eg: VARIABLE_1, VARIABLE_2
variables=($(egrep -o '"\${[A-Z_]+}"' $config | egrep -o '[A-Z_]+'))

# validate that all placeholders have corresponding environment variables
for variable in ${variables[@]}; do 
    if [[ -z ${!variable+x} ]]; then
        echo "environment variable $variable not found"
        exit 1
    fi
done

# create SHELL_FORMAT string for all placeholders eg: $VARIABLE_1$VARIABLE_2
specified_placeholders=$(IFS='$'; echo "\$${variables[*]}")

# substitutes ONLY the specified_placeholders' placeholders with environment variables, reducing the 
# risk of replacing other non-placeholder but similiarly formatted strings with environment variables
envsubst "$specified_placeholders" < $config | tee $config

source /docker-entrypoint.sh "$@"