list:
	@npm run | grep '^  [^ ]' | tr -d ' '

%::
	@npm run $@
