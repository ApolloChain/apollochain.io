/**
 * This is a helper file to run tests.
 *
 * Code in this project expects to be run by bin/www, so code imports others based on the path of bin/www.
 * Leveraging this helper file, we don't break the path convention and can run tests.
 */
require.main.require('../helpers/chain_apis/tests/chain')
