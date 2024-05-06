<?php
/**
 * OceanWP Child Theme Functions
 *
 * When running a child theme (see http://codex.wordpress.org/Theme_Development
 * and http://codex.wordpress.org/Child_Themes), you can override certain
 * functions (those wrapped in a function_exists() call) by defining them first
 * in your child theme's functions.php file. The child theme's functions.php
 * file is included before the parent theme's file, so the child theme
 * functions will be used.
 *
 * Text Domain: oceanwp
 * @link http://codex.wordpress.org/Plugin_API
 *
 */

/**
 * Load the parent style.css file
 *
 * @link http://codex.wordpress.org/Child_Themes
 */
function oceanwp_child_enqueue_parent_style() {

	// Dynamically get version number of the parent stylesheet (lets browsers re-cache your stylesheet when you update the theme).
	$theme   = wp_get_theme( 'OceanWP' );
	$version = $theme->get( 'Version' );

	// Load the stylesheet.
	wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'oceanwp-style' ), $version );
	
}

add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_parent_style' );


// Save the checkbox field data Dusty
function save_reseller_field($user_id) {
	if (current_user_can('edit_user', $user_id)) {
			update_user_meta($user_id, 'reseller', $_POST['reseller']);
	}
}
add_action('personal_options_update', 'save_reseller_field');
add_action('edit_user_profile_update', 'save_reseller_field');

function kia_hide_tax_from_product_query( $q ) {
	$tax_query = $q->get( 'tax_query' );

	$tax_query[] = array(
                'taxonomy' => 'product_cat',
                'field'    => 'id',
                'terms'    => array( 90 ), // Category ID to exclude
                'operator' => 'NOT IN',
	);
	$q->set( 'tax_query', $tax_query );

}
add_action( 'woocommerce_product_query', 'kia_hide_tax_from_product_query' );


// Register custom REST API endpoint to retrieve user meta data
function custom_get_all_users_meta_endpoint_init() {
    register_rest_route( 'custom/v1', '/all-users-meta', array(
        'methods'  => 'GET',
        'callback' => 'custom_get_all_users_meta_callback',
    ) );
}
add_action( 'rest_api_init', 'custom_get_all_users_meta_endpoint_init' );

// Callback function to retrieve user meta data for all users
function custom_get_all_users_meta_callback( $data ) {
    // Get all user IDs
    $users = get_users( array( 'fields' => 'ID' ) );

    $user_meta_data = array();

    // Loop through each user
    foreach ( $users as $user_id ) {
        // Get user meta data
        $user_meta = get_user_meta( $user_id );

        // Check if the "reseller" field exists for the user
            // Get the value of the "reseller" field
            $reseller_value = isset( $user_meta['reseller'] ) && is_array( $user_meta['reseller'] ) && ! empty( $user_meta['reseller'][0] ) && $user_meta['reseller'][0];

            // Get user email
            $user_info = get_userdata( $user_id );
            $user_email = $user_info->user_email;

            // Add user ID, email, and "reseller" meta data to the response
            $user_meta_data[] = array(
                'user_id' => $user_id,
                'email' => $user_email,
                'reseller' => $reseller_value,
            );
    }

    // Return user meta data for all users in the response
    return rest_ensure_response( $user_meta_data );
}

// Register custom REST API endpoint to retrieve user meta data
function custom_get_logged_in_user() {
    register_rest_route( 'custom/v1', '/current-user', array(
        'methods'  => 'GET',
        'callback' => 'custom_get_logged_in_user_callback',
    ) );
}
add_action( 'rest_api_init', 'custom_get_logged_in_user' );

// Callback function to retrieve user meta data for all users
function custom_get_logged_in_user_callback( $data ) {
    // Get the ID of the logged-in user
    $current_user_id = get_current_user_id();

    // Get user data
    $user_info = get_userdata( $current_user_id );

    // Get user email
    $user_email = $user_info->user_email;

    // Get username
    $username = $user_info->user_login;

    // Check if user is administrator
    $is_administrator = in_array( 'administrator', $user_info->roles );

    // Create an array with user ID, email, username, and administrator status
    $user_data = array(
        'user_id' => $current_user_id,
        'email' => $user_email,
        'username' => $username,
        'is_administrator' => $is_administrator,
    );
    
    // Return user data for the logged-in user in the response
    return rest_ensure_response( $user_data );
}

// Register custom REST API endpoint to add a design
function custom_add_design_endpoint_init() {
    register_rest_route( 'custom/v1', '/add-design', array(
        'methods'  => 'POST',
        'callback' => 'custom_add_design_callback',
    ) );
}
add_action( 'rest_api_init', 'custom_add_design_endpoint_init' );

// Callback function for adding a design
function custom_add_design_callback( $request ) {
    // Get request parameters
    $parameters = $request->get_json_params();

    // Extract data from parameters
    $user_id = isset( $parameters['user_id'] ) ? intval( $parameters['user_id'] ) : 0;
    $email = isset( $parameters['email'] ) ? sanitize_email( $parameters['email'] ) : '';
    $name = isset( $parameters['name'] ) ? sanitize_text_field( $parameters['name'] ) : '';
    $images = isset( $parameters['images'] ) ? json_encode( $parameters['images'] ) : '';
    $template = isset( $parameters['template'] ) ? sanitize_text_field( $parameters['template'] ) : '';
    $conversation = isset( $parameters['conversation'] ) ? json_encode( $parameters['conversation'] ) : '';
    $product_id = isset( $parameters['product_id'] ) ? intval( $parameters['product_id'] ) : 0;

    // Validate required fields
    if ( empty( $user_id ) || empty( $email ) || empty( $name ) || empty( $images ) || empty( $conversation ) ) {
        return new WP_Error( 'invalid_parameters', 'One or more required parameters are missing or empty.', array( 'status' => 400 ) );
    }

    // Insert design into the designs table
    global $wpdb;
    $table_name = 'designs';

    $wpdb->insert(
        $table_name,
 array(
            'user_id' => $user_id,
            'email' => $email,
            'name' => $name,
            'images' => $images,
            'template' => $template,
            'conversation' => $conversation,
            'product_id' => $product_id,
        ),
        array(
            '%d',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
            '%s',
        )
    );

    // Check if the design was successfully added
    if ( $wpdb->insert_id ) {
        return array( 'message' => 'Design added successfully.', 'design_id' => $wpdb->insert_id );
    } else {
         // Get the last database error message
        $error_message = $wpdb->last_error;

        // Return error message
        return new WP_Error( 'database_error', $error_message, array( 'status' => 500 ) );
    }
}

// Register custom REST API endpoint to fetch designs for the current user
function custom_get_user_designs_endpoint_init() {
    register_rest_route( 'custom/v1', '/user-designs', array(
        'methods'  => 'GET',
        'callback' => 'custom_get_user_designs_callback',
        'permission_callback' => function () {
            return is_user_logged_in(); // Ensure user is logged in
        }
    ) );
}
add_action( 'rest_api_init', 'custom_get_user_designs_endpoint_init' );

// Callback function for fetching designs for the current user
function custom_get_user_designs_callback( $request ) {
    global $wpdb;

    // Get the current user ID
    $user_id = get_current_user_id();

    // Get designs for the current user
    $table_name = 'designs';
    $designs = $wpdb->get_results( $wpdb->prepare(
        "SELECT * FROM $table_name WHERE User_id = %d",
        $user_id
    ) );

    // Check if designs were found
    if ( $designs ) {
        return $designs;
    } else {
        return new WP_Error( 'no_designs_found', 'No designs found for the current user.', array( 'status' => 404 ) );
    }
}

// Register custom REST API endpoint to update a design
function custom_update_design_endpoint_init() {
    register_rest_route( 'custom/v1', '/update-design/(?P<id>\d+)', array(
        'methods'  => 'POST',
        'callback' => 'custom_update_design_callback',
        'permission_callback' => function () {
            return is_user_logged_in(); // Ensure user is logged in
        }
    ) );
}
add_action( 'rest_api_init', 'custom_update_design_endpoint_init' );

// Callback function for updating a design
function custom_update_design_callback( $request ) {
    global $wpdb;

    // Get design ID from URL parameters
    $design_id = $request->get_param( 'id' );

    // Get request parameters
    $parameters = $request->get_json_params();

    // Validate design ID
    if ( ! $design_id ) {
        return new WP_Error( 'invalid_design_id', 'Invalid design ID.', array( 'status' => 400 ) );
    }

    // Perform database update
    $table_name = 'designs';
    $update_result = $wpdb->update(
        $table_name,
        $parameters, // Update data
        array( 'Id' => $design_id ), // Where clause
        array(), // Data formats
        array( '%d' ) // Where clause formats
    );

    // Check if the update was successful
    if ( $update_result === false ) {
              // Get the last database error message
        $error_message = $wpdb->last_error;

        // Return error message
        return new WP_Error( 'database_error', $error_message, array( 'status' => 500 ) );
    }

    // Return success response
    return array( 'message' => 'Design updated successfully.' );
}

// Register custom REST API endpoint to delete a design
function custom_delete_design_endpoint_init() {
    register_rest_route( 'custom/v1', '/delete-design/(?P<id>\d+)', array(
        'methods'  => 'DELETE',
        'callback' => 'custom_delete_design_callback',
        'permission_callback' => function () {
            return is_user_logged_in(); // Ensure user is logged in
        }
    ) );
}
add_action( 'rest_api_init', 'custom_delete_design_endpoint_init' );

// Callback function for deleting a design
function custom_delete_design_callback( $request ) {
    global $wpdb;

    // Get design ID from URL parameters
    $design_id = $request->get_param( 'id' );

    // Validate design ID
    if ( ! $design_id ) {
        return new WP_Error( 'invalid_design_id', 'Invalid design ID.', array( 'status' => 400 ) );
    }

    // Perform database delete
    $table_name = 'designs';
    $delete_result = $wpdb->delete(
        $table_name,
        array( 'Id' => $design_id ), // Where clause
        array( '%d' ) // Where clause formats
    );

    // Check if the delete was successful
    if ( $delete_result === false ) {
        return new WP_Error( 'failed_to_delete_design', 'Failed to delete design from the database.', array( 'status' => 500 ) );
    }

    // Return success response
    return array( 'message' => 'Design deleted successfully.' );
}

// Register custom REST API endpoint to add a template
function custom_add_template_endpoint_init() {
    register_rest_route( 'custom/v1', '/add-template', array(
        'methods'  => 'POST',
        'callback' => 'custom_add_template_callback',
    ) );
}
add_action( 'rest_api_init', 'custom_add_template_endpoint_init' );

// Callback function for adding a template
function custom_add_template_callback( $request ) {
    // Get request parameters
    $parameters = $request->get_json_params();

    // Extract data from parameters
    $template = isset( $parameters['template'] ) ? sanitize_text_field( $parameters['template'] ) : '';
    $product_id = isset( $parameters['product_id'] ) ? intval( $parameters['product_id'] ) : 0;

    // Validate required fields
    if ( empty( $template ) ) {
        return new WP_Error( 'invalid_parameters', 'Template url is required.', array( 'status' => 400 ) );
    }

    // Insert template into the template table
    global $wpdb;
    $table_name = 'template'; // Assuming your table name is 'template'

    $wpdb->insert(
        $table_name,
        array(
            'template' => $template,
            'product_id' => $product_id,
        ),
        array(
            '%s',
            '%d',
        )
    );

    // Check if the template was successfully added
    if ( $wpdb->insert_id ) {
        return array( 'message' => 'Template added successfully.', 'template_id' => $wpdb->insert_id );
    } else {
        // Get the last database error message
        $error_message = $wpdb->last_error;

        // Return error message
        return new WP_Error( 'database_error', $error_message, array( 'status' => 500 ) );
    }
}

// Register custom REST API endpoint to update a template
function custom_update_template_endpoint_init() {
    register_rest_route( 'custom/v1', '/update-template/(?P<id>\d+)', array(
        'methods'  => 'POST',
        'callback' => 'custom_update_template_callback',
        'args'     => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric( $param );
                }
            ),
        ),
    ) );
}
add_action( 'rest_api_init', 'custom_update_template_endpoint_init' );

// Callback function for updating a template
function custom_update_template_callback( $request ) {
    // Get template ID from the URL parameters
    $template_id = $request->get_param( 'id' );

    // Get request parameters
    $parameters = $request->get_json_params();

    // Extract data from parameters
    $template = isset( $parameters['template'] ) ? sanitize_text_field( $parameters['template'] ) : '';
    $product_id = isset( $parameters['product_id'] ) ? intval( $parameters['product_id'] ) : 0;

    // Validate required fields
    if ( empty( $template ) ) {
        return new WP_Error( 'invalid_parameters', 'Template name is required.', array( 'status' => 400 ) );
    }

    // Update template in the template table
    global $wpdb;
    $table_name = 'template'; // Assuming your table name is 'template'

    $updated = $wpdb->update(
        $table_name,
        array(
            'template' => $template,
            'product_id' => $product_id,
        ),
        array( 'ID' => $template_id ),
        array(
            '%s',
            '%d',
        ),
        array( '%d' )
    );

    // Check if the template was successfully updated
    if ( $updated !== false ) {
        return array( 'message' => 'Template updated successfully.', 'template_id' => $template_id );
    } else {
        // Get the last database error message
        $error_message = $wpdb->last_error;

        // Return error message
        return new WP_Error( 'database_error', $error_message, array( 'status' => 500 ) );
    }
}

// Register custom REST API endpoint to fetch templates
function custom_fetch_templates_endpoint_init() {
    register_rest_route( 'custom/v1', '/fetch-templates', array(
        'methods'  => 'GET',
        'callback' => 'custom_fetch_templates_callback',
    ) );
}
add_action( 'rest_api_init', 'custom_fetch_templates_endpoint_init' );

// Callback function for fetching templates
function custom_fetch_templates_callback( $request ) {
    // Get templates from the database
    global $wpdb;
    $table_name = 'template'; // Assuming your table name is 'template'

    $templates = $wpdb->get_results( "SELECT * FROM $table_name" );

    // Check if templates were found
    if ( $templates ) {
        // Prepare response data
        $response_data = array();

        foreach ( $templates as $template ) {
            $response_data[] = array(
                'id' => $template->ID,
                'template' => $template->template,
                'product_id' => $template->product_id,
            );
        }

        // Return templates in the response
        return rest_ensure_response( $response_data );
    } else {
        // Return error message if no templates were found
        return new WP_Error( 'no_templates_found', 'No templates found.', array( 'status' => 404 ) );
    }
}

// Register custom REST API endpoint to delete a template
function custom_delete_template_endpoint_init() {
    register_rest_route( 'custom/v1', '/delete-template/(?P<id>\d+)', array(
        'methods'  => 'DELETE',
        'callback' => 'custom_delete_template_callback',
        'args'     => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric( $param );
                }
            ),
        ),
    ) );
}
add_action( 'rest_api_init', 'custom_delete_template_endpoint_init' );

// Callback function for deleting a template
function custom_delete_template_callback( $request ) {
    // Get template ID from the URL parameters
    $template_id = $request->get_param( 'id' );

    // Check if template exists
    global $wpdb;
    $table_name = 'template'; // Assuming your table name is 'template'

    $template = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE ID = %d", $template_id ) );

    if ( ! $template ) {
        return new WP_Error( 'template_not_found', 'Template not found.', array( 'status' => 404 ) );
    }

    // Delete template from the database
    $deleted = $wpdb->delete(
        $table_name,
        array( 'ID' => $template_id ),
        array( '%d' )
    );

    // Check if the template was successfully deleted
    if ( $deleted ) {
        return array( 'message' => 'Template deleted successfully.', 'template_id' => $template_id );
    } else {
        // Get the last database error message
        $error_message = $wpdb->last_error;

        // Return error message
        return new WP_Error( 'database_error', $error_message, array( 'status' => 500 ) );
    }
};


// Step 1: Register Custom Routes
function register_product_designs_routes() {
    register_rest_route( 'custom/v1', '/product-designs', array(
        array(
            'methods'  => WP_REST_Server::READABLE,
            'callback' => 'get_product_designs',
        ),
        array(
            'methods'  => WP_REST_Server::CREATABLE,
            'callback' => 'add_product_design',
            'permission_callback' => 'product_designs_permissions_check',
        ),
            array(
      'methods' => WP_REST_Server::EDITABLE,
      'callback' => 'update_product_design',
      'permission_callback' => 'product_designs_permissions_check',
    ),
        array(
      'methods' => WP_REST_Server::DELETABLE,
      'callback' => 'delete_product_design',
      'permission_callback' => 'product_designs_permissions_check',
    ),
    ));
}
add_action( 'rest_api_init', 'register_product_designs_routes' );

// Step 2: Define Callback Functions

function product_designs_permissions_check() {
    return true;
}


function get_product_designs( $request ) {
    // Step 3: Access the Database
    global $wpdb;
    $table_name ='product_designs';

    // Step 4: Implement CRUD Operations
    $current_user = wp_get_current_user();
    if ( $current_user->ID == 0 ) {
        return new WP_Error( 'not_logged_in', 'User not logged in', array( 'status' => 401 ) );
    }

    $user_id = $current_user->ID;
    $product_designs = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $table_name WHERE user_id = %d", $user_id ), ARRAY_A );

    if ( empty( $product_designs ) ) {
        return new WP_Error( 'no_data', 'No product designs found for the current user', array( 'status' => 404 ) );
    }

    return rest_ensure_response( $product_designs );
}

function add_product_design( $request ) {
    // Step 3: Access the Database
    global $wpdb;
    $table_name = 'product_designs';

    // Step 4: Implement CRUD Operations
    $current_user = wp_get_current_user();
    if ( $current_user->ID == 0 ) {
        return new WP_Error( 'not_logged_in', 'User not logged in', array( 'status' => 401 ) );
    }

    $user_id = $current_user->ID;

    // Retrieve request parameters
    $parameters = $request->get_params();

    // Validate required parameters
    if ( empty( $parameters['order_product_id'] ) || empty( $parameters['design_id'] ) ) {
        return new WP_Error( 'missing_parameters', 'Required parameters are missing', array( 'status' => 400 ) );
    }

    // Insert new product design into the database
    $wpdb->insert( $table_name, array(
        'order_product_id' => $parameters['order_product_id'],
        'user_id' => $user_id,
        'design_id' => $parameters['design_id'],
    ) );

    return rest_ensure_response( 'Product design added successfully' );
}

function update_product_design($request)
{
  // Step 3: Access the Database
  global $wpdb;
  $table_name = 'product_designs';

  $parameters = $request->get_params();
  $user_id = get_current_user_id();

  // Check if required parameters are present
  if (empty($parameters['id']) || empty($parameters['order_product_id']) || empty($parameters['design_id'])) {
    return new WP_Error('missing_parameters', 'Required parameters are missing', array('status' => 400));
  }

  $id = $parameters['id'];

  // Check if the product design belongs to the current user
  $existing_design = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE ID = %d AND user_id = %d", $id, $user_id));
  if (!$existing_design) {
    return new WP_Error('not_found', 'Product design not found or does not belong to the current user', array('status' => 404));
  }

  // Update database record
  $wpdb->update($table_name, array(
    'order_product_id' => $parameters['order_product_id'],
    'design_id' => $parameters['design_id'],
  ), array('ID' => $id));

  return rest_ensure_response('Product design updated successfully');
}

function delete_product_design($request)
{
  // Step 3: Access the Database
  global $wpdb;
  $table_name = 'product_designs';

  $parameters = $request->get_params();
  $user_id = get_current_user_id();

  // Check if required parameters are present
  if (empty($parameters['id'])) {
    return new WP_Error('missing_parameters', 'Required parameters are missing', array('status' => 400));
  }

  $id = $parameters['id'];

  // Check if the product design belongs to the current user
  $existing_design = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE ID = %d AND user_id = %d", $id, $user_id));
  if (!$existing_design) {
    return new WP_Error('not_found', 'Product design not found or does not belong to the current user', array('status' => 404));
  }

  // Delete database record
  $wpdb->delete($table_name, array('ID' => $id));

  return rest_ensure_response('Product design deleted successfully');
}

// Step 1: Register Custom Routes
function register_resellers_routes() {
        register_rest_route( 'custom/v1', '/resellers-all', array(
        array(
            'methods'  => WP_REST_Server::READABLE,
            'callback' => 'get_all_resellers',
        ),
    ));
    
    register_rest_route( 'custom/v1', '/resellers', array(
        array(
            'methods'  => WP_REST_Server::READABLE,
            'callback' => 'get_resellers',
        ),
        array(
            'methods'  => WP_REST_Server::CREATABLE,
            'callback' => 'add_reseller',
            'permission_callback' => 'resellers_permissions_check',
        ),
        array(
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => 'update_reseller',
            'permission_callback' => 'resellers_permissions_check',
        ),
        array(
            'methods' => WP_REST_Server::DELETABLE,
            'callback' => 'delete_reseller',
            'permission_callback' => 'resellers_permissions_check',
        ),
    ));
}
add_action( 'rest_api_init', 'register_resellers_routes' );

// Step 2: Define Callback Functions

function resellers_permissions_check() {
    return true;
}

function get_all_resellers( $request ) {
    // Step 3: Access the Database
    global $wpdb;
    $table_name ='8q1_resellers';

    // Step 4: Implement CRUD Operations
    $resellers = $wpdb->get_results( "SELECT * FROM $table_name", ARRAY_A );

    return rest_ensure_response( $resellers );
}

function get_resellers( $request ) {
    global $wpdb;
    $table_name ='8q1_resellers';

    // Step 4: Implement CRUD Operations
    $current_user = wp_get_current_user();
    if ( $current_user->ID == 0 ) {
        return new WP_Error( 'not_logged_in', 'User not logged in', array( 'status' => 401 ) );
    }

    $user_id = $current_user->ID;
    $reseller = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE user_id = %d", $user_id ), ARRAY_A );

    if ( empty( $reseller ) ) {
        return new WP_Error( 'no_reseller_found', 'No reseller found for the current user', array( 'status' => 404 ) );
    }

    return rest_ensure_response( $reseller );
}

function add_reseller( $request ) {
    // Step 3: Access the Database
    global $wpdb;
    $table_name = '8q1_resellers';

    // Step 4: Implement CRUD Operations
    $parameters = $request->get_params();

    // Validate required parameters
    if ( empty( $parameters['user_id'] ) || empty( $parameters['email'] ) || empty( $parameters['store_name'] ) || empty( $parameters['status'] ) ) {
        return new WP_Error( 'missing_parameters', 'Required parameters are missing', array( 'status' => 400 ) );
    }

    // Insert new reseller into the database
    $wpdb->insert( $table_name, array(
        'user_id' => $parameters['user_id'],
        'email' => $parameters['email'],
        'store_name' => $parameters['store_name'],
        'about' => isset( $parameters['about'] ) ? $parameters['about'] : '',
        'articles' => isset( $parameters['articles'] ) ? $parameters['articles'] : '',
        'permit' => isset( $parameters['permit'] ) ? $parameters['permit'] : '',
        'status' => $parameters['status'],
        'message' => isset( $parameters['message'] ) ? $parameters['message'] : '',
    ) );

    return rest_ensure_response( 'Reseller added successfully' );
}

function update_reseller($request)
{
    // Step 3: Access the Database
    global $wpdb;
    $table_name = '8q1_resellers';

    $parameters = $request->get_params();

    // Check if required parameters are present
    if (empty($parameters['ID'])) {
        return new WP_Error('missing_parameters', 'Reseller ID is required for updating', array('status' => 400));
    }

    $id = $parameters['ID'];

    // Check if the reseller with the provided ID exists
    $existing_reseller = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE ID = %d", $id));
    if (!$existing_reseller) {
        return new WP_Error('not_found', 'Reseller not found', array('status' => 404));
    }

    // Prepare data for update
    $data = array();
    if (!empty($parameters['user_id'])) {
        $data['user_id'] = $parameters['user_id'];
    }
    if (!empty($parameters['email'])) {
        $data['email'] = $parameters['email'];
    }
    if (!empty($parameters['store_name'])) {
        $data['store_name'] = $parameters['store_name'];
    }
    if (isset($parameters['about'])) {
        $data['about'] = $parameters['about'];
    }
    if (isset($parameters['articles'])) {
        $data['articles'] = $parameters['articles'];
    }
    if (isset($parameters['permit'])) {
        $data['permit'] = $parameters['permit'];
    }
    if (!empty($parameters['status'])) {
        $data['status'] = $parameters['status'];
    }
    if (isset($parameters['message'])) {
        $data['message'] = $parameters['message'];
    }

    // Perform the update
    $wpdb->update($table_name, $data, array('ID' => $id));

    return rest_ensure_response('Reseller updated successfully');
}


function delete_reseller($request)
{
    // Step 3: Access the Database
    global $wpdb;
    $table_name = '8q1_resellers';

    $parameters = $request->get_params();

    // Check if required parameters are present
    if ( empty( $parameters['ID'] ) ) {
        return new WP_Error( 'missing_parameters', 'Required parameters are missing', array( 'status' => 400 ) );
    }

    $id = $parameters['ID'];

    // Delete database record
    $wpdb->delete( $table_name, array( 'ID' => $id ) );

    return rest_ensure_response( 'Reseller deleted successfully' );
}






function add_cors_headers( $headers ) {
    $allowed_origins = array(
        'https://ppw-next.vercel.app/'
    );

    $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';

    if ( in_array( $origin, $allowed_origins ) ) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Methods'] = 'POST';
        $headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }

    return $headers;
}
add_filter( 'rest_pre_serve_request', 'add_cors_headers' );

function delete_token_cookie_on_logout() {
    setcookie('token', '', time() - 3600, '/'); // Set the expiration time to a past time
}
add_action('wp_logout', 'delete_token_cookie_on_logout');

function reorder_logout_link( $items ) {
    // Store the logout link
    $logout_link = $items['customer-logout'];

    // Remove the logout link from its current position
    unset( $items['customer-logout'] );

    // Add the logout link after the custom links
    $items['designs'] = 'Designs';
    $items['reseller'] = 'Reseller'; // New link titled "Reseller"
    $items['customer-logout'] = $logout_link; // Re-add the logout link

    return $items;
}
add_filter( 'woocommerce_account_menu_items', 'reorder_logout_link' );

// Redirect the custom link to the specified URL
function redirect_custom_my_account_link() {
    // Check if the current URL matches the custom-designs action
    if ( is_account_page() && isset( $_GET['action'] ) && $_GET['action'] === 'custom-designs' ) {
        // Redirect to the external URL
        wp_redirect( 'https://ppw-next.vercel.app/custom-form' );
        exit();
    }
}
add_action( 'template_redirect', 'redirect_custom_my_account_link' );

// Register custom REST API endpoint to encrypt token and set as cookie
function custom_encrypt_token_endpoint_init() {
    register_rest_route('custom/v1', '/encrypt-token', array(
        'methods'  => 'POST',
        'callback' => 'custom_encrypt_token_callback',
    ));
}
add_action('rest_api_init', 'custom_encrypt_token_endpoint_init');

// Callback function to encrypt token and set as cookie
function custom_encrypt_token_callback($request) {
    $parameters = $request->get_json_params();

    if (isset($parameters['token'])) {
        $token = $parameters['token'];
        $encryption_key = 'x3zP6#G@u&K8!qY2gsdfghsdf'; // Replace with your secret key

        // Encrypt token using AES encryption
        $encrypted_token = openssl_encrypt($token, 'aes-256-cbc', $encryption_key, 0, $encryption_key);

        if ($encrypted_token === false) {
            // Error occurred during encryption
            return new WP_Error('encryption_error', 'Error encrypting token', array('status' => 500));
        }

        // Set encrypted token as cookie with the domain pricepointwholesale.com
setcookie('encrypted_token', $encrypted_token, time() + (86400 * 30), "/", "pricepointwholesale.com");
setcookie('token', $token, time() + (86400 * 30), "/", "pricepointwholesale.com");

        return rest_ensure_response('Token encrypted and set as cookie successfully');
    } else {
        return new WP_Error('missing_token', 'Token parameter missing', array('status' => 400));
    }
}





