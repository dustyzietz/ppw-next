<?php
function register_product_designs_routes()
{
  register_rest_route('custom/v1', '/product-designs', array(
    array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => 'get_product_designs',
    ),
    array(
      'methods' => WP_REST_Server::CREATABLE,
      'callback' => 'create_product_design',
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
add_action('rest_api_init', 'register_product_designs_routes');

// Step 2: Define Callback Functions
function product_designs_permissions_check()
{
  if (!current_user_can('edit_posts')) {
    return new WP_Error('rest_forbidden', esc_html__('You cannot access this resource', 'my-plugin'), array('status' => rest_authorization_required_code()));
  }
  return true;
}

function get_product_designs( $request ) {
  // Step 3: Access the Database
  global $wpdb;
  $table_name = $wpdb->prefix . 'product_designs';

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

function create_product_design($request)
{
  // Step 3: Access the Database
  global $wpdb;
  $table_name = 'product_designs';

  $parameters = $request->get_params();
  $user_id = get_current_user_id();

  // Check if required parameters are present
  if (empty($parameters['order_product_id']) || empty($parameters['design_id'])) {
    return new WP_Error('missing_parameters', 'Required parameters are missing', array('status' => 400));
  }

  // Insert into database
  $wpdb->insert($table_name, array(
    'order_product_id' => $parameters['order_product_id'],
    'user_id' => $user_id,
    'design_id' => $parameters['design_id'],
  ));

  return rest_ensure_response('Product design created successfully');
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
