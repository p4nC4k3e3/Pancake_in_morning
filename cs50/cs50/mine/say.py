import sys
from sayings import main
from sayings import hello
from sayings import goodbye

if len(sys.argv) == 2:
    hello(sys.argv[1])

elif len(sys.argv) == 3:
    goodbye(sys.argv[2])

else:
    main()