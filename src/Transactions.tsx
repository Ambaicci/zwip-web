// src/Transactions.tsx - COMPLETELY REWRITTEN WITH PROPER SYNTAX
import { useState, useMemo } from 'react';
import { useStore } from './store/useStore';
import { THEME } from './theme';
import BottomNav from './components/Navigation/BottomNav';

type ScreenType = 'home' | 'send' | 'add' | 'receive' | 'pay' | 'scan' | 'cashAgent' | 'transactions' | 'settings' | 'profile' | 'menu' | 'more';
type TransactionType = 'all' | 'sent' | 'received' | 'paid' | 'withdrawal' | 'added' | 'refund';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';
type SortOption = 'date' | 'amount' | 'name';

interface EnhancedTransaction {
  id: string;
  type: 'sent' | 'received' | 'paid' | 'withdrawal' | 'added' | 'refund';
  name: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  category?: string;
  note?: string;
  contact?: string;
  fee?: number;
  location?: string;
}

export default function Transactions({ setCurrentScreen }: { setCurrentScreen: (screen: ScreenType) => void }) {
  const {  } = useStore();
  const [activeFilter, setActiveFilter] = useState<TransactionType>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setSelectedTransaction] = useState<EnhancedTransaction | null>(null);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Enhanced transaction data with realistic information
  const enhancedTransactions: EnhancedTransaction[] = useMemo(() => [
    {
      id: '1', type: 'sent', name: 'Sarah Wilson', amount: 25.00,
      date: new Date('2024-10-04T14:30:00'), status: 'completed',
      category: 'Personal', note: 'Lunch', contact: '+1 (555) 111-2222',
      fee: 0.50, location: 'New York, NY'
    },
    {
      id: '2', type: 'received', name: 'Mike Johnson', amount: 100.00,
      date: new Date('2024-10-04T12:15:00'), status: 'completed',
      category: 'Personal', note: 'Birthday gift', contact: '+1 (555) 222-3333',
      location: 'Chicago, IL'
    },
    {
      id: '3', type: 'paid', name: 'Starbucks Coffee', amount: 8.50,
      date: new Date('2024-10-04T10:45:00'), status: 'completed',
      category: 'Food & Drink', note: 'Morning coffee',
      fee: 0.25, location: 'Local Store'
    },
    {
      id: '4', type: 'sent', name: 'Emily Davis', amount: 50.00,
      date: new Date('2024-10-03T16:20:00'), status: 'completed',
      category: 'Personal', note: 'Dinner', contact: '+1 (555) 333-4444',
      fee: 0.75, location: 'Los Angeles, CA'
    },
    {
      id: '5', type: 'received', name: 'Alex Brown', amount: 75.00,
      date: new Date('2024-10-03T14:10:00'), status: 'completed',
      category: 'Business', note: 'Project payment', contact: '+1 (555) 444-5555',        
      location: 'Miami, FL'
    },
    {
      id: '6', type: 'withdrawal', name: 'ATM Cash Withdrawal', amount: 200.00,
      date: new Date('2024-10-01T11:30:00'), status: 'completed',
      category: 'Cash', note: 'ATM #1234', fee: 2.50, location: 'Main Street ATM'
    },
    {
      id: '7', type: 'added', name: 'Bank Transfer', amount: 500.00,
      date: new Date('2024-09-30T09:15:00'), status: 'completed',
      category: 'Transfer', note: 'Monthly deposit', location: 'Bank of America'
    },
    {
      id: '8', type: 'paid', name: 'Uber Ride', amount: 32.50,
      date: new Date('2024-09-29T19:45:00'), status: 'completed',
      category: 'Transport', note: 'Airport ride', fee: 0.75, location: 'Uber'
    },
    {
      id: '9', type: 'refund', name: 'Amazon Refund', amount: 45.00,
      date: new Date('2024-09-28T14:20:00'), status: 'completed',
      category: 'Shopping', note: 'Return processed', location: 'Amazon.com'
    },
    {
      id: '10', type: 'sent', name: 'Netflix Subscription', amount: 15.99,
      date: new Date('2024-09-27T08:00:00'), status: 'completed',
      category: 'Entertainment', note: 'Monthly subscription', fee: 0.25,
      location: 'Netflix'
    },
    {
      id: '11', type: 'paid', name: 'Groceries', amount: 87.43,
      date: new Date('2024-09-26T17:30:00'), status: 'completed',
      category: 'Shopping', note: 'Weekly groceries', fee: 0.50,
      location: 'Whole Foods'
    },
    {
      id: '12', type: 'received', name: 'Freelance Payment', amount: 1200.00,
      date: new Date('2024-09-25T10:00:00'), status: 'completed',
      category: 'Business', note: 'Website project', location: 'Client Corp'
    }
  ], []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = enhancedTransactions.filter(transaction => {
      // Type filter
      if (activeFilter !== 'all' && transaction.type !== activeFilter) return false;      

      // Time filter
      const now = new Date();
      const transactionDate = new Date(transaction.date);

      switch (timeFilter) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return transactionDate >= yearAgo;
        default:
          return true;
      }
    });

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.name.toLowerCase().includes(query) ||
        transaction.note?.toLowerCase().includes(query) ||
        transaction.category?.toLowerCase().includes(query) ||
        transaction.contact?.includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedTransactions, activeFilter, timeFilter, searchQuery, sortBy, sortOrder]);   

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalTransactions = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);       
    const totalIncoming = filteredTransactions
      .filter(t => t.type === 'received' || t.type === 'added' || t.type === 'refund')    
      .reduce((sum, t) => sum + t.amount, 0);
    const totalOutgoing = filteredTransactions
      .filter(t => t.type === 'sent' || t.type === 'paid' || t.type === 'withdrawal')     
      .reduce((sum, t) => sum + t.amount, 0);
    const totalFees = filteredTransactions.reduce((sum, t) => sum + (t.fee || 0), 0);     

    // Category breakdown
    const categories = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      if (!acc[category]) acc[category] = { amount: 0, count: 0 };
      acc[category].amount += transaction.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // Type breakdown
    const types = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.type]) acc[transaction.type] = { amount: 0, count: 0 };
      acc[transaction.type].amount += transaction.amount;
      acc[transaction.type].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return {
      totalTransactions,
      totalAmount,
      totalIncoming,
      totalOutgoing,
      totalFees,
      netAmount: totalIncoming - totalOutgoing,
      categories,
      types
    };
  }, [filteredTransactions]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sent': return '';
      case 'received': return '';
      case 'paid': return '';
      case 'withdrawal': return '';
      case 'added': return '';
      case 'refund': return '';
      default: return '';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sent':
      case 'paid':
      case 'withdrawal':
        return '#dc2626'; // Red for outgoing
      case 'received':
      case 'added':
      case 'refund':
        return THEME.green; // Green for incoming
      default:
        return THEME.white;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'sent': return 'Sent';
      case 'received': return 'Received';
      case 'paid': return 'Payment';
      case 'withdrawal': return 'Withdrawal';
      case 'added': return 'Added';
      case 'refund': return 'Refund';
      default: return type;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return diffDays + ' days ago';

    return transactionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: transactionDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined   
    });
  };

  const handleExport = async () => {
    setExporting(true);
    // Simulate export process
    setTimeout(() => {
      alert('Transaction statement exported successfully!');
      setExporting(false);
    }, 1500);
  };

  const FilterButton = ({ type, label }: { type: TransactionType; label: string }) => (   
    <button
      onClick={() => setActiveFilter(type)}
      style={{
        padding: '10px 16px',
        background: activeFilter === type ? THEME.green : 'rgba(255, 255, 255, 0.05)',    
        border: '1px solid ' + (activeFilter === type ? THEME.green : 'rgba(255, 255, 255, 0.1)'),
        borderRadius: '20px',
        color: activeFilter === type ? THEME.black : THEME.white,
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  );

  const TimeFilterButton = ({ type, label }: { type: TimeFilter; label: string }) => (    
    <button
      onClick={() => setTimeFilter(type)}
      style={{
        padding: '8px 12px',
        background: timeFilter === type ? THEME.emeraldLight : 'rgba(255, 255, 255, 0.05)',
        border: '1px solid ' + (timeFilter === type ? THEME.emeraldLight : 'rgba(255, 255, 255, 0.1)'),
        borderRadius: '12px',
        color: timeFilter === type ? THEME.black : THEME.white,
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: THEME.black,
      color: THEME.white,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        flex: 1,
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <button
            onClick={() => setCurrentScreen('home')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: THEME.green,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: '10px',
              minWidth: '70px',
              flexShrink: 0,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = THEME.green;
              e.currentTarget.style.color = THEME.black;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = THEME.green;
            }}
          >
            Back
          </button>

          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: THEME.white,
            textAlign: 'center',
            flex: 1
          }}>
            Transactions
          </h1>

          <div style={{ width: '70px', flexShrink: 0 }}></div>
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '16px',
          width: '100%',
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)'
        }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: THEME.white,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Analytics Toggle */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '16px',
          width: '100%',
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: THEME.white }}>     
                Transaction Analytics
              </div>
              <div style={{ fontSize: '12px', color: THEME.muted }}>
                {filteredTransactions.length} transactions found
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                padding: '10px 16px',
                background: showAnalytics ? THEME.green : 'rgba(255, 255, 255, 0.05)',    
                border: '1px solid ' + (showAnalytics ? THEME.green : 'rgba(255, 255, 255, 0.1)'),
                borderRadius: '10px',
                color: showAnalytics ? THEME.black : THEME.white,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>
          </div>

          {showAnalytics && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: THEME.muted, marginBottom: '4px' }}>Total In</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: THEME.green }}> 
                    
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: THEME.muted, marginBottom: '4px' }}>Total Out</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>   
                    
                  </div>
                </div>
              </div>
              <div style={{
                background: analytics.netAmount >= 0 ? 'rgba(0, 103, 79, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid ' + (analytics.netAmount >= 0 ? 'rgba(0, 103, 79, 0.3)' : 'rgba(220, 38, 38, 0.3)')
              }}>
                <div style={{ fontSize: '12px', color: THEME.muted, marginBottom: '4px' }}>Net Flow</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: analytics.netAmount >= 0 ? THEME.green : '#dc2626'
                }}>
                  {analytics.netAmount >= 0 ? '+' : ''}  
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <TimeFilterButton type="all" label="All Time" />
          <TimeFilterButton type="today" label="Today" />
          <TimeFilterButton type="week" label="This Week" />
          <TimeFilterButton type="month" label="This Month" />
          <TimeFilterButton type="year" label="This Year" />
        </div>

        {/* Type Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <FilterButton type="all" label="All" />
          <FilterButton type="sent" label="Sent" />
          <FilterButton type="received" label="Received" />
          <FilterButton type="paid" label="Payments" />
          <FilterButton type="withdrawal" label="Withdrawals" />
          <FilterButton type="added" label="Added" />
        </div>

        {/* Sort Options */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.2) 100%)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '12px', color: THEME.muted, fontWeight: 600 }}>
            Sort by:
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: THEME.white,
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: THEME.white,
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {sortOrder === 'asc' ? '' : ''}
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
          {filteredTransactions.length > 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.2) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)'
            }}>
              {filteredTransactions.map((transaction, index) => (
                <button
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: index < filteredTransactions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    color: THEME.white,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';       
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: transaction.type === 'received' || transaction.type === 'added' || transaction.type === 'refund'
                      ? 'rgba(0, 103, 79, 0.2)'
                      : 'rgba(220, 38, 38, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: getTransactionColor(transaction.type),
                    flexShrink: 0,
                    border: '1px solid ' + getTransactionColor(transaction.type) + '20'
                  }}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: THEME.white,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {transaction.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: THEME.muted,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span>{getTransactionLabel(transaction.type)}</span>
                      <span></span>
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.category && (
                        <>
                          <span></span>
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            {transaction.category}
                          </span>
                        </>
                      )}
                    </div>
                    {transaction.note && (
                      <div style={{
                        fontSize: '11px',
                        color: THEME.muted,
                        marginTop: '2px',
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {transaction.note}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: getTransactionColor(transaction.type),
                      marginBottom: '2px'
                    }}>
                      {(transaction.type === 'sent' || transaction.type === 'paid' || transaction.type === 'withdrawal') ? '-' : '+'}
                      
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: THEME.muted,
                      fontWeight: 600
                    }}>
                      {transaction.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.9) 0%, rgba(6, 46, 38, 0.3) 100%)',
              padding: '40px 30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                fontSize: '24px'
              }}>
                
              </div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: THEME.white
              }}>
                No Transactions Found
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: THEME.muted,
                lineHeight: '1.5'
              }}>
                {searchQuery
                  ? 'No transactions match your search criteria.'
                  : 'No ' + (activeFilter !== 'all' ? getTransactionLabel(activeFilter).toLowerCase() : '') + ' transactions found for the selected period.'
                }
              </p>
            </div>
          )}

          {/* Export Button */}
          {filteredTransactions.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                width: '100%',
                padding: '16px',
                background: exporting ? 'rgba(255, 255, 255, 0.05)' : THEME.green,        
                border: 'none',
                borderRadius: '12px',
                color: exporting ? THEME.muted : THEME.black,
                fontSize: '14px',
                fontWeight: 700,
                cursor: exporting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {exporting ? ' Exporting...' : ' Export Statement'}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen="transactions"
        onNavigate={setCurrentScreen}
      />
    </div>
  );
}
